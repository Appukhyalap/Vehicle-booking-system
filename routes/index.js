const express = require("express");
const router = express.Router();

router.get("/" , (req,  res) => {
    let error = req.flash("error" , "user created succesully...!");
    res.render("index" , {error});
});

module.exports = router;