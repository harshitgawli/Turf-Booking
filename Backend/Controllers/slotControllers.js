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


const razorpay = require("../Config/razorpay.js");

// CREATE PAYMENT ORDER
exports.createOrder = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot || slot.status !== "available") {
      return res.status(400).json({ message: "Slot not available" });
    }

    const order = await razorpay.orders.create({
      amount: 500,
      currency: "INR",
      receipt: `slot_${slot._id}`
    });

    res.json({
      orderId: order.id,
      amount: order.amount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment order failed" });
  }
};



const crypto = require("crypto");

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      slotId
    } = req.body;

    // 🔐 Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 🎯 Book slot
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    slot.status = "booked";
    slot.bookedBy = req.userId;
    await slot.save();

    // 👤 Get user
    const user = await User.findById(req.userId);

    // 📧 SEND CONFIRMATION EMAIL
    if (user) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "✅ Turf Booking Confirmed",
        text: `
Hi ${user.name || "User"},

Your turf booking has been successfully confirmed 🎉

📅 Date: ${slot.date}
⏰ Time: ${slot.time}

We look forward to seeing you on the field!

– Turf Booking Team
        `
      });
    }

    res.json({
      message: "Payment successful, booking confirmed & email sent"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
