const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const isLoggedIn = require("../middleware/isloggedIn");
const { createBooking, completeRide, cancelBooking} = require("../controllers/bookingController");
const userModel = require("../models/user-model");
const userBookingModel = require("../models/userBooking-model");
const upload = require("../config/multer-config");



router.post("/register", registerUser);

router.post("/login", loginUser);


router.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
});

router.get("/bookVehicles", (req, res) => {
    res.render("bookvehicle");
});

router.get("/completeRiding", isLoggedIn, async (req, res) => {
    try {

        // let user = req.user;
        let driver = await userModel.findOne({ role: "driver", _id: req.user._id });
        if (!driver) {
            console.log("Only drivers can access this page.");
            return res.redirect("/");
        }

        const booking = await userBookingModel.findOne({ driver: driver._id })
            .populate("user")
            .populate("vehicle");

        if (!booking) {
            return res.status(404).send("No active ride found for this driver.");
        }

        if (booking.driver.toString() !== req.user._id.toString()) {
            return res.status(403).send("This ride does not belong to you");
        } 

        res.render("completeRide", {booking , driver});
        // res.redirect("/users/profile" , {booking});
    } catch (err) {
        console.error("Error loading complete ride page:", err.message);
        res.status(500).send("Something went wrong.");
    }

});

// routes/userRoutes.js
router.get("/mybookings", isLoggedIn, async (req, res) => {
    try {
        const bookings = await userBookingModel
            .find({ user: req.user._id })
            .populate("vehicle")
            .populate("driver");

        res.render("myBookings", { bookings });
    } catch (err) {
        console.error("Error fetching bookings:", err.message);
        res.status(500).send("Failed to retrieve bookings.");
    }
});


router.get("/upload/profilePicture" , isLoggedIn, async (req, res) => {
    try {
        res.render("profileupload");
    } catch (err) {
        console.error("Error fetching bookings:", err.message);
    }
});


router.get("/profile" , isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.user._id});
        let driver = await userModel.findOne({ role: "driver", _id: req.user._id });
        let booking = null;
        if(user.role === "driver") {
            booking = await userBookingModel.findOne({ driver: driver._id });
        }
        
        res.render("profile" , {user , booking});
    } catch (err) {
        console.error("Error fetching bookings:", err.message);
    }
});



router.get("/editBooking/:bookingId" , isLoggedIn, async (req, res) => {
    try {
        let booking = await userBookingModel.findOne({_id: req.params.bookingId});
        res.render("editBooking" , {booking});
    } catch (err) {
        console.error("Error fetching bookings:", err.message);
    }
});



router.post("/profile/upload" , upload.single("image") , isLoggedIn , async(req , res) => {
    const user = await userModel.findOne({_id: req.user._id});
    user.profilepic = req.file.filename;
    await user.save();
    res.redirect("/users/profile");
});

// router.post("/editBooking/:booking" , isLoggedIn , editBooking);
router.post("/cancel-booking/:bookingId" , isLoggedIn , cancelBooking);
router.post("/bookvehicle", isLoggedIn, createBooking);
router.post("/ride/:bookingId/complete", isLoggedIn, completeRide);

module.exports = router;