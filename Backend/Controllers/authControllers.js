const User = require("../Models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });

  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// CREATE DEFAULT ADMIN (Run Once)
exports.createAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const bcrypt = require("bcryptjs");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@turf.com",
      mobile: "9999999999",
      password: hashedPassword,
      role: "admin"
    });

    res.json({
      message: "Admin created successfully",
      email: "admin@turf.com",
      password: "admin123"
    });

  } catch (err) {
    console.error("Create Admin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
