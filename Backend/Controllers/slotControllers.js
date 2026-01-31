const Slot = require("../Models/Slot.js");
const User = require("../Models/User.js");
const transporter = require("../Config/mailer.js");

// CREATE SLOT (Admin)
exports.createSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    const slotExists = await Slot.findOne({ date, time });

    if (slotExists) {
      return res
        .status(400)
        .json({ message: "Slot already exists" });
    }

    const slot = await Slot.create({
      date,
      time
    });

    res.json({ message: "Slot created", slot });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// BOOK SLOT (Atomic)
exports.bookSlot = async (req, res) => {
  try {
    const slot = await Slot.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "available"
      },
      {
        status: "pending",
        bookedBy: req.userId
      },
      { new: true }
    );

    if (!slot) {
      return res.status(400).json({
        message: "Slot not available"
      });
    }

    res.json({
      message: "Slot pending. Complete payment & wait for admin confirmation."
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN CONFIRM BOOKING
// ADMIN CONFIRM BOOKING
exports.confirmBooking = async (req, res) => {
  try {
    const slotId = req.params.id;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.status !== "pending") {
      return res.status(400).json({
        message: "Slot is not in pending state"
      });
    }

    slot.status = "booked";
    await slot.save();

    const user = await User.findById(slot.bookedBy);

    if (user) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Turf Booking Confirmed",
        text: `Your booking is successful!

Date: ${slot.date}
Time: ${slot.time}

Thank you for choosing our turf.`
      });
    }

    res.json({ message: "Slot confirmed & email sent" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// USER BOOKING HISTORY
exports.myBookings = async (req, res) => {
  try {
    const slots = await Slot.find({
      bookedBy: req.userId,
      status: "booked"
    });

    res.json(slots);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ADMIN VIEW ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Slot.find({
      status: { $in: ["pending", "booked"] }
    }).populate("bookedBy", "name email");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
