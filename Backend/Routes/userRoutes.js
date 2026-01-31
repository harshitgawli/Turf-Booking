const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  login,
  registerSendOtp
} = require("../Controllers/authControllers.js");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/register-send-otp", registerSendOtp);
module.exports = router;
