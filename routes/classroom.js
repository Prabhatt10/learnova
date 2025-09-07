const express = require("express");
const router = express.Router();

const {createClassroom} = require("../controller/classroom");

router.post("./createClassroom",createClassroom);

module.exports = router;