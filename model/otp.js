const mongoose = require("mongoose");
const mailSender = require("../util/mailSender");
const emailVerificationTemplate = require("../mailTemplate/verification");

const otpSchema = new mongoose.Schema ({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 5 * 60 
    }
});

exports.sendVerificationEmail = async (email,otp) => {
    try{
        const emailResponse = await mailSender(
            email ,
            "verification Email",
            emailVerificationTemplate(otp)
        );
        console.log("email sent successfully");
    } catch(error){
        return resizeBy.status(500).json({
            success : false,
            message : "OTP cannot be sent"
        });
    }
}

module.exports = model("otp",otpSchema);