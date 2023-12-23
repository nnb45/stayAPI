const express = require("express");
const hotelModel = require("./HotelModel");
const mailer = require("nodemailer");

// Lấy danh sách khách sạn
const getAllHotel = async (page, size) => {
    let skip = (page - 1) * size;
    let limit = size;
    try {
        return await hotelModel.find().sort({ _id: -1 });
    } catch (error) {
        console.log("Get all hotel service error:", error);
        throw error;
    }
};

module.exports = { getAllHotel };