const express = require("express");

// import routers
const auth = require("./routes/auth.js");
const classroom = require("./routes/classroom.js");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 4000;

const {dbConnect} = require("./config/database.js");
dbConnect();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",auth);
app.use("/api/v1/classroom",classroom);

app.listen(PORT,()=>{
    console.log(`Server Starting at Port ${PORT}`);  
});