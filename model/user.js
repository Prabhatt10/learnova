const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    userType: {
        type: String,
        enum: ["created", "joined"]
    },
    classroom: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "classroom"
    }],
    progress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    }],
    attendance: [{   // fixed spelling
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "message"
    }],
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "setting",
        default: null
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true });   // optional, adds createdAt & updatedAt

module.exports = mongoose.model("user", userSchema);