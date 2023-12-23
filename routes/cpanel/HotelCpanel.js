const express = require('express');
const router = express.Router();
const hotelController = require('../../components/hotel/HotelController.js');
// const getAllHotels = require('../../controllers/hotel.js');
const { createHotel, getHotelRooms, getAllHotels, updateHotel, deleteHotel, getHotelById, searchHotels,
    sortHotels,
    getHotelDetails,
    filterByRoomStatus, deleteRoom, getHotelRoomsSua, updateRoomDetailsById, getMostBookedRoomDetails } = require("../controllers/hotel");
/**
 * Hiển thị trang danh sách khách sạn
 * http://localhost:3000//
 */
router.get('/', async function (req, res, next) {
    try {
        const query = await hotelController.getAllHotels();
        const hotels = query.map(hotels => {
            return {
                _id: hotels._id,
                hotelName: hotels.hotelName,
                price: p.price,
                quantity: p.quantity,
                image: p.image,
                description: p.description,
                categoryId: p.categoryId,
                index: index + 1,
            }
        });
        // dành cho web
        // res.render('products/listsp', { sp: products });
        res.render('hotel/list', { hotels })
    } catch (error) {
        console.log("Get all hotel error" + error);
        throw error;
    }
});

module.exports = router;