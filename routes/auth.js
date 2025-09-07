const express = require("express");
const router = express.Router();

const {signUp,sendRegistrationOtp,login} = require("../controller/auth");
const {resetPasswordByOtp , resetPassword} = require("../controller/resetPassword");


const {auth} = require("../middleware/authMiddleware");

router.post("/signup",signUp);
router.post("/sendRegistrationOtp",sendRegistrationOtp);
router.post("/login",login);
router.post("/resetPasswordByOtp",resetPasswordByOtp);
router.post("/resetPassword",resetPassword);

module.exports = router;