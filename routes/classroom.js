const express = require("express");
const router = express.Router();

const {createClassroom} = require("../controller/classroom");
const {auth} = require("../middleware/authMiddleware");

router.post("/createClassroom",auth ,createClassroom);

module.exports = router;