const USER = require("../model/user");
const OTP = require("../model/otp");
const otpGenerator = require("otp-generator");
const {mailVerificationTemplate} = require("../mailTemplate/verification");
const mailSender = require("../util/mailSender");
const bcrypt = require("bcrypt");
const {generateAccessToken , generateRefreshToken} = require("../util/token");
require("dotenv").config();
const jwt = require("jsonwebtoken");



// signup
exports.signUp = async (req,res) => {
    try{
        const {userName , email , password , confirmPassword , otp} = req.body
        if(!userName || !email || !password || !confirmPassword) {
            return res.status(401).json({
                success : false,
                message : "All fields are required,Please try Again"
            });
        }
        if(password != confirmPassword){
            return res.status(403).json({
                success : false,
                message : "Password did't matched"
            });
        }

        const existingUser = await USER.findOne({email});

        if(existingUser){
            return res.status(403).json({
                success : false,
                message : "User already exists"
            });
        }

        // find most recent OTP
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!recentOTP) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        // console.log("otp :" , otp),
        // console.log("recent otp : ", recentOTP.otp);

        if (String(otp).trim() !== String(recentOTP.otp).trim()) {
            return res.status(400).json({
                success: false,
                message: "Wrong OTP, Please enter correct OTP"
            });
        }


        const hashedPassword = await bcrypt.hash(password,10);

        // create entry in DB 

        const user = await USER.create({
            userName,
            email, 
            password : hashedPassword,
            isAccountVerified: true,
        });

        // create refresh token and access token 
        const refreshToken = await generateRefreshToken(user._id);
        const accessToken = await generateAccessToken(user._id);

        // Save tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,                   // cannot be accessed via JS
            secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
            maxAge: 15 * 60 * 1000,           // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        });

        // send welcome email
        try {
            const welcomeMail = await mailSender(
                email,
                "Honour to onboard your Learning journey",
                `Welcome ${userName} to LearnOva! We are glad to have you on board. Please verify your email to get started`
            )
        } catch (error) {
            return res.status(403).json({
                success : false,
                message : "Welcome email cannot be send"
            });
        }

    return res.status(200).json({
        success : true,
        message : "User registered Successfuly",
        refreshToken,
        accessToken
    });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "code fatt gya registration me"
        });
    }
}

// registration OTP
exports.sendRegistrationOtp = async (req,res) => {
    try{
        const {email} = req.body;
        const checkUserPresent = await USER.findOne({email});

        if (checkUserPresent) {
            if (checkUserPresent.isAccountVerified) {
                return res.status(400).json({
                    success: false,
                    message: "Account is already verified",
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "User already present, cannot send registration OTP",
                });
            }
        }


        // generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars: false,
        });

        let result = await OTP.findOne({otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars: false,
            });
            result = await OTP.findOne({otp});
        }

        console.log("this is the otp : " ,otp);

        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);

        try {
            const registrationMail = await mailSender(
                email,
                "Registration Confirmation OTP",
                `Enter this OTP to confirm Registration ${otp}`
            );
        } catch (error) {
            return res.status(404).json({
                success : false,
                message : "Can't send OTP, Please try again later"
            });
        }

        // const registrationMail = await mailSender(
        //     email,
        //     "Registration Confirmation OTP",
        //     `Enter this OTP to confirm Registration ${otp}`
        // );

        return res.status(200).json({
            success : true,
            message : "OTP sent successfully",
            // otp
        });


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "error in sending OTP"
        });
    }
}

exports.login = async (req,res) => {
    try {
        // get data
        const {email,password} = req.body;

        // validation
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Enter Email and password to login"
            });
        }

        const user = await USER.findOne({email});

        if (!user) {
            return res.json({
                success: false,
                message: "User not found with this email, Please complete the registration",
            });
        }

        const compareUserPassword = await bcrypt.compare(password,user.password);

        if(!compareUserPassword){
            return res.status(401).json({
                success : false,
                message : "Invalid Paswword, Please try again"
            });
        }

        // generate token and store in cookie
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // console.log("token is : ", token);

        // create refresh token and access token
        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        // Save tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,                   // cannot be accessed via JS
            secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
            maxAge: 15 * 60 * 1000,           // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        });

        user.password = undefined;

        // console.log(user.password);

        return res.status(200).json({
            success : true,
            message : "User logged in successfully",
            refreshToken,
            accessToken,
            token,
            user
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
            message : "Internal Server error while login, Please try again after some"
        });
    }
}

