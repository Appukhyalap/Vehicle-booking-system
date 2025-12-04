const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    console.log("Cookie Token:", token);

    if (!token) {
        console.log("User is not logged in");
        return res.redirect("/");
    }

    try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.user = data;
        next();
    } catch (err) {
        console.log("Invalid Token", err.message);
        return res.redirect("/");
    }
}

module.exports = isLoggedIn;