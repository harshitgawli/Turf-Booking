const Slot = require("../Models/Slot.js");
const User = require("../Models/User.js");

// Utility: Generate 6 digit booking number
const generateBookingNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



// CREATE SLOT (Admin)
// 

const getPriceByHour = (hour) => {
  if (hour >= 6 && hour < 10) return 499;
  if (hour >= 10 && hour < 17) return 399;
  if (hour >= 17 && hour < 24) return 649;
  return 0;
};

// ADMIN: Generate full day slots (6AM–12AM)
exports.createSlot = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const existing = await Slot.findOne({ date });

    if (existing) {
      return res.status(400).json({ message: "Slots already generated for this date" });
    }

    const slotsToCreate = [];

    for (let hour = 6; hour < 24; hour++) {
      const start = `${hour}:00`;
      const end = `${hour + 1}:00`;

      slotsToCreate.push({
        date,
        time: `${start} - ${end}`,
        price: getPriceByHour(hour),
        status: "available"
      });
    }

    await Slot.insertMany(slotsToCreate);

    res.json({ message: "Full day slots generated successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



// GET ALL SLOTS
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find()
      .sort({ date: 1, time: 1 })
      .populate("bookedBy", "name mobile email");

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// BOOK SLOT (User → Pending)
exports.bookSlot = async (req, res) => {
  try {

    const requestCode = generateCode();

    const slot = await Slot.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "available"
      },
      {
        status: "pending",
        bookedBy: req.userId,
        requestCode: requestCode
      },
      { new: true }
    );

    if (!slot) {
      return res.status(400).json({ message: "Slot not available" });
    }

    res.json({
      message: "Slot request created. Please call admin to confirm booking.",
      requestCode: requestCode
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
    slot.paymentType = "online";

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
    slot.paymentType = null;
    slot.offlineCustomer = null;


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

// ADMIN OFFLINE BOOKING
exports.offlineBooking = async (req, res) => {
  try {
    const { slotId, name, email, mobile } = req.body;

    const slot = await Slot.findById(slotId);

    if (!slot || slot.status !== "available") {
      return res.status(400).json({ message: "Slot not available" });
    }

    slot.status = "booked";
    slot.customerName = name;
    slot.customerEmail = email;
    slot.customerMobile = mobile;
    slot.paymentMode = "cash";
    slot.bookingNumber = generateBookingNumber();

    await slot.save();

    res.json({ message: "Offline booking created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


