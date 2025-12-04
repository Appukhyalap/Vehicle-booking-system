const userModel = require("../models/user-model");
const userBookingModel = require("../models/userBooking-model");
const bookingModel = require("../models/userBooking-model");
const vehicleModel = require("../models/vehicle-model");

let createBooking = async (req, res) => {

    console.log(req.body);
    try {
        const { vehicleType, pickupLocation, dropLocation, pickupDateTime, dropDateTime, paymentMethod } = req.body;

        const vehicleTypelower = vehicleType.toLowerCase();

        // 1. Find an available driver and vehicle
        const availableDriver = await userModel.findOne({ role: "driver", isAvailable: true });
        const availableVehicle = await vehicleModel.findOne({ status: "available", type: vehicleTypelower });
        const user = await userModel.findOne({ _id: req.user._id });

        if (!availableDriver) {
            console.log("No available drivers found");
            return res.redirect("/");
        }
        if (!availableVehicle) {
            console.log("No available vehicles of the requested type");
            return res.redirect("/vehicles/create");
        }

        const paymentStatus = paymentMethod === "cash" ? "pending" : "completed";
        const bookingStatus = paymentStatus === "completed" ? "confirmed" : "pending";

        // 2. Calculate estimated price (example: ₹20/km + ₹50 base fare)
        const estimatedAmount = 200; // Replace with real logic

        // 3. Create booking with payment details
        const booking = await bookingModel.create({
            user: req.user._id,
            vehicle: availableVehicle._id,
            pickupLocation,
            dropLocation,
            pickupDateTime,
            dropDateTime,
            driver: availableDriver._id,
            totalFare: estimatedAmount,
            paymentStatus,
            bookingStatus,
        });

        user.bookings.push(booking._id);
        await user.save();


        // 4. Mark driver and vehicle as unavailable
        availableDriver.isAvailable = false;
        await availableDriver.save();

        availableVehicle.status = "booked";
        await availableVehicle.save();

        console.log("Booking confirmed:", booking);
        res.status(200).send("Booking created successfully with payment info");

    } catch (err) {
        console.log("Error in booking:", err.message);
        res.status(500).send("Booking failed");
    }
};

const completeRide = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await bookingModel.findById(bookingId);
        if (!booking) return res.status(404).send("Booking not found");

        const driver = await userModel.findOne({ _id: booking.driver._id });
        if (driver) {
            driver.isAvailable = true;
            await driver.save();
        }

        const vehicle = await vehicleModel.findOne({ _id: booking.vehicle._id });
        if (vehicle) {
            vehicle.status = "available";
            await vehicle.save();
        }

        booking.bookingStatus = "completed";
        booking.isrideCompleted = true;
        console.log("Updated Booking:", booking);
        await booking.save();

        res.status(200).send("Ride marked as completed successfully");
    } catch (err) {
        console.error("Error completing ride:", err.message);
        res.status(500).send("Failed to complete ride");
    }
};


const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        console.log(req.user);

        // Find the booking
        const booking = await userBookingModel.findOne({ _id: bookingId });

        // Check if exists and belongs to the user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).send("You can't cancel this booking.");
        }

        // Check if already completed or cancelled
        if (booking.bookingStatus === "completed" || booking.bookingStatus === "cancelled") {
            return res.status(400).send("This booking already cancelled.");
        }

        // Cancel the booking
        booking.bookingStatus = "cancelled";
        await booking.save();

        // Optional: make driver and vehicle available again
        await userModel.findOneAndUpdate({ _id: booking.driver._id }, { isAvailable: true });
        await vehicleModel.findOneAndUpdate({ _id: booking.vehicle._id }, { status: "available" });

        res.redirect("/users/mybookings"); // or send a response
    } catch (err) {
        console.error("Error cancelling booking:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

 // controllers/bookingController.js
// let editBooking = async (req, res) => {
//   console.log(req.body);
//     try {
//         const { vehicleType, pickupLocation, dropLocation, pickupDateTime, dropDateTime, paymentMethod } = req.body;

//         const vehicleTypelower = vehicleType.toLowerCase();

//         // 1. Find an available driver and vehicle

//         if (!availableDriver) {
//             console.log("No available drivers found");
//             return res.redirect("/");
//         }
//         if (!availableVehicle) {
//             console.log("No available vehicles of the requested type");
//             return res.redirect("/vehicles/create");
//         }

//         const paymentStatus = paymentMethod === "cash" ? "pending" : "completed";
//         const bookingStatus = paymentStatus === "completed" ? "confirmed" : "pending";

//         // 2. Calculate estimated price (example: ₹20/km + ₹50 base fare)
//         const estimatedAmount = 200; // Replace with real logic

//         // 3. Create booking with payment details
//         const booking = await bookingModel.create({
//             user: req.user._id,
//             vehicle: availableVehicle._id,
//             pickupLocation,
//             dropLocation,
//             pickupDateTime,
//             dropDateTime,
//             driver: availableDriver._id,
//             totalFare: estimatedAmount,
//             paymentStatus,
//             bookingStatus,
//         });

//         user.bookings.push(booking._id);
//         await user.save();


//         // 4. Mark driver and vehicle as unavailable
//         availableDriver.isAvailable = false;
//         await availableDriver.save();

//         availableVehicle.status = "booked";
//         await availableVehicle.save();

//         console.log("Booking confirmed:", booking);
//         res.status(200).send("Booking created successfully with payment info");

//     } catch (err) {
//         console.log("Error in booking:", err.message);
//         res.status(500).send("Booking failed");
//     }
// };


module.exports = {
    createBooking,
    completeRide,
    cancelBooking,
    // editBooking
};

