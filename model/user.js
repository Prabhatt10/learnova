const mongoose = require("mongoose");
const nodemon = require("nodemon");

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type :String,
        required : true,
    },
    confirmPassword : {
        type : String ,
        required : true
    },
    active : {
        type : Boolean,
        default : true
    },
    userType : {
        type : String,
        enum : ["created" , "joined"]
    },
    classroom : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "classroom",
            default : null
        }
    ],
    progress : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "class",
            default : null
        }
    ],
    attendence : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "class",
            default : null
        }
    ],
    messages : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "message",
        default : none
    },
    additionalDetails : {
        type : mongoose.Schema.Types,
        ref : "setting",
    },
    isAccountVerified : {
        type : String,
        default : false
    },
    token : {
        type : String
    },
    resetOtp : {
        type : String,
        default : ""
    },
    resetPasswordExpires : {
        type : Date
    }
});

module.exports = model("user",userSchema);