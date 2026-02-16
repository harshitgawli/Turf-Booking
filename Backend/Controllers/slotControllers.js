const Slot = require("../Models/Slot.js");
const User = require("../Models/User.js");

// Utility: Generate 6 digit booking number
const generateBookingNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// CREATE SLOT (Admin)
exports.createSlot = async (req, res) => {
  try {
    const { date, time } = req.body;

    const slotExists = await Slot.findOne({ date, time });

    if (slotExists) {
      return res.status(400).json({ message: "Slot already exists" });
    }

    const slot = await Slot.create({ date, time });

    res.json({ message: "Slot created", slot });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL SLOTS
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().populate("bookedBy", "name mobile email");
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// BOOK SLOT (User → Pending)
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
      return res.status(400).json({ message: "Slot not available" });
    }

    res.json({
      message: "Slot request created. Please call admin to confirm booking."
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ADMIN CONFIRM BOOKING
exports.confirmBooking = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.status !== "pending") {
      return res.status(400).json({ message: "Slot is not pending" });
    }

    slot.status = "booked";
    slot.bookingNumber = generateBookingNumber();

    await slot.save();

    res.json({
      message: "Booking confirmed successfully",
      bookingNumber: slot.bookingNumber
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ADMIN CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.status === "available") {
      return res.status(400).json({ message: "Slot already available" });
    }

    slot.status = "available";
    slot.bookedBy = null;
    slot.bookingNumber = null;

    await slot.save();

    res.json({ message: "Booking cancelled & slot is now available" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// USER BOOKING HISTORY (Only Confirmed)
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
    }).populate("bookedBy", "name mobile email");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN VIEW ONLY PENDING BOOKINGS
exports.getPendingBookings = async (req, res) => {
  try {
    const pending = await Slot.find({
      status: "pending"
    }).populate("bookedBy", "name mobile email");

    res.json(pending);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
