const USER = require("../model/user");
const CLASSROOM = require("../model/classroom");
const FILE = require("../model/file");

exports.createClassroom = async (req,res) => {
    try {
        const userID = req.user.id;
        const { className , subjectName , subjectCode , privacy } = req.body;
        if(!className || !subjectName || !subjectCode || !privacy){
            return res.status(400).json({
                success : false,
                message : "Enter all fields to create the classroom"
            });
        }
        
        const userDetails = await USER.findById(userID);

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        let isDuplicate = true;
        const length = 6; // or whatever length you want

        while (isDuplicate) {
            // generate new code
            code = '';
            for (let i = 0; i < length; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            // check if code exists
            const checkCodeAlreadyExists = await CLASSROOM.findOne({ classJoinCode : code });
            if (!checkCodeAlreadyExists) {
                isDuplicate = false;
            }
        }


        console.log("Unique Classroom Code:", code);

        // Build class URL (you can replace localhost:5000 with your frontend or API domain)
        const classUrl = `${req.protocol}://${req.get("host")}/classroom/join/${code}`;

        console.log("Class URl : ",classUrl);

        const newClassroom = await CLASSROOM.create ({
            className ,
            subjectName,
            subjectCode,
            privacy : privacy,
            instructor : userDetails._id,
            classJoinCode : code,
            classUrl : classUrl,
        });

        // add classroom to user schema
        await USER.findByIdAndUpdate(
            userDetails._id,
            {
                $push : {
                    classroom : newClassroom._id
                }
            },
            {new : true}
        );

        return res.status(200).json({
            success : true,
            message : "New course created successfully and User updated with the new classroom details"
        });


    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Classroom cannot be created at a moment, Please try again"
        });
    }
}
