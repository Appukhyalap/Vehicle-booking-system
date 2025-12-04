const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/userRouter");
const db = require("./config/mongoose-connection");
const userModel = require("./models//user-model");
const vehicleModel = require("./models/vehicle-model");
const vehicleRouter = require("./routes/vehicleRouter");
const express_session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const hostname = "localhost";
const port = 3000;

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname , "public")));
app.use(
    express_session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_EXPRESS_SECRET
    })
)
app.use(flash());


app.use("/" , indexRouter);
app.use("/users" , userRouter);
app.use("/vehicles" , vehicleRouter);

app.listen(3000 , () => {
    console.log(`running on http://${hostname}:${port}`);
});
