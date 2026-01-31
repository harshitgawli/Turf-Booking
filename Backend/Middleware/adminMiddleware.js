const User = require("../Models/User.js");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only"
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;
