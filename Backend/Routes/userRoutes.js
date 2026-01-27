const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  login
} = require("../Controllers/authControllers.js");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

module.exports = router;
