const hotelService = require('./HotelService');

const getAllHotels = async () => {
    try {
        const hotels = await hotelService.getAllHotel();
        return hotels;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getAllHotels };