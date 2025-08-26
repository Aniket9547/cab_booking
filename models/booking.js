const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    payment: { type: String, required: true },
    passengerCount: { type: String, required: true },
    carType: { type: String, required: true }
}, { timestamps: true });

// 👇 yahi final export hoga, aur is file ke andar koi aur require nahi lagega
module.exports = mongoose.model("Booking", bookingSchema);
