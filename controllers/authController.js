const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken")

let registerUser = async (req, res) => {
    try{

        let { fullname, email, phone, password, role } = req.body;
    
        let user = await userModel.findOne({ email });
        if (user) {
            console.log("user with this email already exists...!");
            res.redirect("/");
        }
    
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async(err, hash) => {
                if(err) return res.send("Error in hashing password");
                let createdUser = await userModel.create({
                    fullname,
                    email,
                    phone,
                    password: hash,
                    role
                });
                console.log("user" , createdUser);
                res.redirect("/");
            });
        });
    } catch(err) {
        console.log(err);
    }

}

let loginUser = async (req , res) => {
    let {email , password} = req.body;

    let user = await userModel.findOne({email});

    if(!user) {
        console.log("user not found");
        res.redirect("/");
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if(err) return res.send("Error in comparing password");
        if(result) {
            const token = generateToken(user);
            console.log(token);
            res.cookie("token" , token);
            console.log(req.cookies);
            console.log("user loggedIn succesfully...!");
            return res.redirect("/users/profile");
        } else {
            console.log("password is incorrect");
            return res.redirect("/");
        }
    }
)}



module.exports = {
    registerUser,
    loginUser
};


