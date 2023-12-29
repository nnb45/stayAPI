const { Hotel } = require('../models/Hotel');
const { Room } = require('../models/Room');

const createHotel = async (req, res, next) => {
    try {
        // Create a new hotel using the request body
        const newHotel = new Hotel(req.body);
        // Save the new hotel to the database
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (error) {
        next(error);
    }
}

const getAllHotels = async (req, res, next) => {
    try {
        const allHotels = await Hotel.find();
        res.status(200).json(allHotels);
    } catch (error) {
        next(error);
    }
}

const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedHotel);
    } catch (error) {
        next(error);
    }
}

const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

const getHotelById = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        next(error);
    }
}

const deleteRoom = async (req, res, next) => {
    try {
        const { hotelId, roomId } = req.params;

        // Find the hotel by ID
        const hotel = await Hotel.findById(hotelId);

        // Find and remove the room from the hotel's rooms array
        hotel.rooms.pull(roomId);

        // Save the updated hotel
        await hotel.save();

        res.status(204).end(); // Room deleted successfully
    } catch (error) {
        next(error);
    }
};

const searchHotels = async (req, res, next) => {
    try {
        const { queryType, value } = req.query;
        const query = {};

        if (queryType === 'phoneNumberHotel' && value) {
            // Convert the value to a number if it's a string
            query.phoneNumberHotel = isNaN(value) ? value : parseInt(value);
        } else if (queryType === 'city' && value) {
            query.hotelCity = value;
        } else if (queryType === 'hotelName' && value) {
            query.hotelName = { $regex: new RegExp(value, 'i') }; // Case-insensitive search
        } else if (queryType === 'roomPrice' && value) {
            // You may adjust the condition based on your specific requirements
            query['rooms.roomPrice'] = { $lte: parseInt(value) };
        } else {
            return res.status(400).json({ message: 'Invalid query type or value' });
        }

        console.log('Query:', query);

        const hotels = await Hotel.find(query);
        res.status(200).json(hotels);
    } catch (error) {
        next(error);
    }
};



const sortHotels = async (req, res, next) => {
    try {
        const { sortBy } = req.query;
        const sortOptions = {};

        if (sortBy === 'rates') {
            sortOptions.hotelRates = 1; // Ascending order
        } else if (sortBy === 'feedback') {
            sortOptions.hotelFeedback = -1; // Descending order
        } else {
            // Handle other sorting criteria as needed
        }

        const sortedHotels = await Hotel.find().sort(sortOptions);
        res.status(200).json(sortedHotels);
    } catch (error) {
        next(error);
    }
}

//luot dat phong nhieu 
const getMostBookedRoomDetails = async (req, res, next) => {
    try {
        // Định nghĩa pipeline cho aggregation
        const pipeline = [
            {
                $unwind: '$rooms',
            },
            {
                $group: {
                    _id: '$rooms',
                    totalBookings: { $sum: 1 },
                },
            },
            {
                $sort: { totalBookings: -1 },
            },
            {
                $limit: 1,
            },
            {
                // Thực hiện left outer join với collection 'rooms' dựa trên '_id' của phòng
                $lookup: {
                    from: 'rooms',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'roomDetails',
                },
            },
            {
                $unwind: '$roomDetails',
            },
            {
                // Tạo cấu trúc kết quả cuối cùng
                $project: {
                    _id: 0,
                    totalBookings: 1,
                    room: '$roomDetails',
                },
            },
        ];

        // Thực hiện aggregation trên collection Hotel
        const result = await Hotel.aggregate(pipeline);

        // Kiểm tra kết quả aggregation
        if (result.length === 0) {
            // Nếu không có kết quả, trả về mã lỗi 404 với thông báo tương ứng
            return res.status(404).json({ message: 'Không tìm thấy thông tin phòng được đặt nhiều nhất' });
        }

        // Nếu có kết quả, trả về thông tin về phòng được đặt nhiều nhất cùng với tổng số lần đặt
        res.status(200).json(result[0]);
    } catch (error) {
        // Xử lý lỗi nếu có
        next(error);
    }
};

const getHotelDetails = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('rooms').populate('hotelDetail');
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        next(error);
    }
}

const getHotelRoomsByHotelId = async (req, res, next) => {
    try {
        // const roomId = await Room.findById(req.params.id);
        // Check if hotel exists
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        // Get all rooms of the hotel, filter by room status
        const rooms = await Hotel.findOne({ _id: req.params.id }).populate({
            path: 'rooms',
            match: { _id: req.params.roomId },
            // populate: {
            //     path: 'room',
            // },
        });

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: 'No rooms found with the specified status' });
        }
        res.status(200).json(rooms.rooms);
        console.log(getHotelRoomsByHotelId);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

const getHotelRooms = async (req, res, next) => {
    try {
        // Populate the 'rooms' field to get details of all rooms associated with all hotels
        const hotels = await Hotel.find({})
            .populate({
                path: 'rooms',
                populate: {
                    path: 'roomDetail',
                },
            })
            .populate('hotelDetail');

        if (!hotels) {
            return res.status(404).json({ message: 'No hotels found' });
        }

        res.status(200).json(hotels);
    } catch (error) {
        next(error);
    }
};

const filterByRoomStatus = async (req, res, next) => {
    try {
        const { roomStatus } = req.query;

        const isRoomAvailable = roomStatus ? roomStatus.toLowerCase() === 'trống' : true;

        // Find hotels with at least one room matching the specified status
        const hotelsWithAvailableRooms = await Hotel.find({
            'rooms.roomStatus': isRoomAvailable,
        }).populate({
            path: 'rooms',
            match: { 'roomStatus': isRoomAvailable },
        }).populate('hotelDetail');  // Populate the hotelDetail field if needed

        res.status(200).json(hotelsWithAvailableRooms);
    } catch (error) {
        next(error);
    }
};

const getHotelRoomsSua = async (req, res, next) => {
    try {
        const hotelId = req.params.hotelId;
        const roomId = req.params.roomId;

        // Find the hotel by ID with populated rooms and hotelDetail
        const hotel = await Hotel.findById(hotelId)
            .populate({
                path: 'rooms',
                populate: {
                    path: 'roomDetail',
                },
            })
            .populate('hotelDetail');

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Find the specific room by ID
        const room = hotel.rooms.find((r) => r._id.toString() === roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Convert the hotel and room documents to plain JavaScript objects
        const hotelData = hotel.toObject();
        const roomData = room.toObject();

        res.status(200).json({ hotel: hotelData, room: roomData });
    } catch (error) {
        next(error);
    }
};

const updateRoomDetailsById = async (req, res, next) => {
    try {
        const hotelId = req.params.hotelId;
        const roomId = req.params.roomId;
        const { roomType, roomPrice, roomStatus } = req.body;

        // Create an object with the fields to update
        const updateFields = {};
        if (roomType) updateFields.roomType = roomType;
        if (roomPrice) updateFields.roomPrice = roomPrice;
        if (roomStatus) updateFields.roomStatus = roomStatus;

        // If you want to update the hotelName of the associated hotel
        const hotelName = req.body.hotelName; // Get hotelName from the request body
        if (hotelName) {
            // Update hotelName in the Hotel model
            await Hotel.findByIdAndUpdate(
                hotelId,
                { $set: { hotelName: hotelName } }
            );
        }

        // Use findByIdAndUpdate to update the room in the database
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            updateFields,
            { new: true } // Return the updated document
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Update successful', room: updatedRoom });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createHotel,
    getHotelRooms,
    getAllHotels,
    updateHotel,
    deleteHotel,
    getHotelById,
    getHotelRoomsByHotelId,
    // existing functions...
    searchHotels,
    sortHotels,
    getHotelDetails,
    deleteRoom,
    getHotelRoomsSua,
    updateRoomDetailsById,
    filterByRoomStatus,
    getMostBookedRoomDetails,
};