// const multer = require("multer");
// const crypto = require("crypto");
// const path = require("path");


// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


const multer = require("multer") //npm i multer
const crypto = require("crypto");
const path = require("path");

//disk torage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },

    filename: function (req, file, cb) { //in this function a file contains all information about the file and also contains the method is original name it will give the file name and extention by the name user saved in the desktop 
        crypto.randomBytes(12 , (err , bytes) => {
            //to convert buffer to hexadecimal use bytes.toString("hex");
            const fn = bytes.toString("hex") + path.extname(file.originalname); 
            cb(null, fn);
        });
    }
});


// /export upload file 
const upload = multer({storage: storage});

module.exports = upload;