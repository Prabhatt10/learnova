const mongoose = require("mongoose");

const sublessonSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    progressTrack : {
        type : Boolean,
        default: false
    },
    fileUrl : {
        type : String
    }
});

module.exports = mongoose.model("sublesson" , sublessonSchema);