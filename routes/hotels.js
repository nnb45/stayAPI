const express = require('express');
const router = express.Router();

const { createHotel, getHotelRooms, getHotelRoomsByHotelId, getAllRoomImageByHotelID, getAllHotels, updateHotel, deleteHotel, getHotelById, searchHotels,
    sortHotels,
    getHotelDetails,
    filterByRoomStatus, deleteRoom, getHotelRoomsSua, updateRoomDetailsById, getMostBookedRoomDetails } = require("../controllers/hotel");

//Sắp xếp:
// Sort hotels based on user criteria
router.get('/sort', sortHotels);

//Tìm kiếm khách sạn theo thành phố và các thông số khác:
// Search hotels based on criteria
router.get('/search', searchHotels);
//! https://stayapi-production.up.railway.app/api/hotel/search?queryType=hotelName&value=Majestic

router.get('/filterByRoomStatus', filterByRoomStatus);

//doanh thu 
router.get('/getMostBookedRoomDetails', getMostBookedRoomDetails);

router.post('/', createHotel);
router.get('/', getAllHotels);
// Update a specific hotel by ID
router.put('/:id', updateHotel);

// Delete a specific hotel by ID
router.delete('/:id', deleteHotel);

// Retrieve a specific hotel by ID
router.get('/:id', getHotelById); //! API đã test 

//Chi tiết khách sạn:
// Retrieve detailed information about a hotel
router.get('/details/:id', getHotelDetails);
router.get('/:id/roomImage', getAllRoomImageByHotelID); // get all room image by hotelID

// get all room in hotel by hotel ID
router.get('/:id/rooms/', getHotelRoomsByHotelId); //? update API

router.get('/rooms/chitietht', getHotelRooms);

// Delete a specific room by ID
router.delete('/rooms/:hotelId/:roomId', deleteRoom);

//hien len form để sửa 
// Updated route for fetching hotel details for editing
router.get('/rooms/chitietht/:hotelId/:roomId', getHotelRoomsSua);

// Add the POST route for updating data
router.put('/hotels/rooms/update/:hotelId/:roomId', updateRoomDetailsById);

module.exports = router;