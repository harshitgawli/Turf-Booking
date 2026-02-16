const express = require("express");
const router = express.Router();

const {
  register,
  login,
  createAdmin
} = require("../Controllers/authControllers.js");

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

//admin create
router.post("/create-admin", createAdmin);
module.exports = router;
