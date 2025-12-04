const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    type: String, // sedan, SUV, etc.
    model: String,
    licensePlate: String,
    status: {
        type: String,
        enum: ["available", "booked", "maintenance"],
        default: "available"
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);