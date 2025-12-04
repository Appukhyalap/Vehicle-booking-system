const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true,
    },
    profilepic: {
        type: String,
        default: "default.png"
    },
    password: String,
    role: {
        type: String,
        enum: ["customer", "admin", "driver"],
        default: "customer"
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
    licenseNumber: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("User", userSchema);