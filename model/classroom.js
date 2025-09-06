const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema ({
    className : {
        type : String,
        required : true
    },
    clasCode : {
        type : String,
        required : true
    },
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    studentEnrolled : [
        {
            type : mongoose.Schema.Types,
            ref : "user",
            default : none
        }
    ],
    privacy : {
        type : String,
        enum : ["anyone","approved"],
        default : "anyone"
    },
    lesson : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "lesson"
        }
    ],
    quiz : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "quiz"
        }
    ],
    favourite : {
        type : Boolean,
        
    }

});

module.exports = model("classroom" , classroomSchema);