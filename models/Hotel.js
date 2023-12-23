const mongoose = require('mongoose')

const HotelSchema = new mongoose.Schema({
    // _id: ObjectId,
    hotelName: { type: String, required: true, unique: true },
    hotelAddress: { type: String, required: true },
    hotelCity: { type: String, required: true },
    phoneNumberHotel: { type: Number, required: true },
    hotelFeedback: { type: String, },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }],
    hotelRates: { type: Number, min: 1, max: 5 },
    hotelCity: { type: String },
    hotelDetail: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelDetail' },
},
    // createdAt và updatedAt
    { timestamps: true }
);

exports.Hotel = mongoose.model("Hotel", HotelSchema);