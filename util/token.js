const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (userID) => {
    return jwt.sign({ id: userID}, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}

exports.generateRefreshToken = (userID) => {
    return jwt.sign({id : userID} , process.env.REFRESH_SECRET , {expiresIn : "7d"})
}