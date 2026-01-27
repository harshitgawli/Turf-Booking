const User = require("../Models/User.js");
const generateOtp = require("../Utils/generateOtp.js");
const transporter = require("../Config/mailer.js");

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY OTP & SET PASSWORD
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, password, name } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.name = name;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Account verified & registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Email not verified" });

    const bcrypt = require("bcryptjs");
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    res.json({ message: "Login successful", userId: user._id });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

