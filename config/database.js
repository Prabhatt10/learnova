const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB connected successfully"))
    .catch((error) => {
        console.log("DB connection failed");
        console.error(error);
        process.exit(1);
    });
};
