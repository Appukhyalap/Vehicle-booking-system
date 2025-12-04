const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isloggedIn");
const {createVehicle , editVehicle} = require("../controllers/vehicleController");
const vehicleModel = require("../models/vehicle-model");


router.get("/create", isLoggedIn, async(req, res) => {
    res.render("createVehicle");
});

router.get("/EditVehicle/:vehicleId", isLoggedIn, async(req, res) => {
    const vehicle = await vehicleModel.findOne({_id: req.params.vehicleId});
    res.render("editVehicle" , {vehicle});
});

router.get("/ShowAllVehicles", isLoggedIn, async(req, res) => {
    try{
        let vehicles = await vehicleModel.find();
        res.render("AllVehicles" , {vehicles})  ;
    }
    catch(err){}
});

router.post("/editVehicle/:vehicleId" , isLoggedIn, editVehicle);
router.post("/createVehicle" , isLoggedIn, createVehicle);

module.exports = router;