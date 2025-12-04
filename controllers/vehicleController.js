const userModel = require("../models/user-model");
const vehicleModel = require("../models/vehicle-model");

let createVehicle = async (req, res) => {
    try {
        let {type, model, licencePlate , status} = req.body;
        console.log(req.body);
        const typelower = type.toLowerCase();
        const user = await userModel.findOne({ email: req.user.email });
        if (user.role !== "admin") {
            console.log("You are not authorized to create a vehicle");
            return res.redirect("/");
        }
        let vehicle = await vehicleModel.create({
            type: typelower,// sedan, SUV, etc.
            model,
            licensePlate: licencePlate,
            status,
        });
        console.log("Vehicle created successfully", vehicle);
        res.redirect("/vehicles/create");
    }
    catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
}

let editVehicle = async (req , res) => {
     try {
        let {type, model, licencePlate , status} = req.body;
        console.log(req.body);
        const typelower = type.toLowerCase();
        const user = await userModel.findOne({ email: req.user.email });
        if (user.role !== "admin") {
            console.log("You are not authorized to Edit a vehicle");
            return res.redirect("/");
        }
        let vehicle = await vehicleModel.findOneAndUpdate(
            { _id: req.params.vehicleId } , 
            {
            type: typelower,// sedan, SUV, etc.
            model,
            licensePlate: licencePlate,
            status,
        },{new: true});
        console.log("Vehicle edited successfully", vehicle);
        res.redirect("/vehicles/create");
    }
    catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
}

module.exports = {
    createVehicle,
    editVehicle
}