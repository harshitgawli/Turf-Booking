const express = require("express");
const router = express.Router();
const adminMiddleware = require("../Middleware/adminMiddleware.js");

const {
  createSlot,
  getAllSlots,
  bookSlot,
  confirmBooking,
  myBookings,
  getAllBookings
} = require("../Controllers/slotControllers.js");

const authMiddleware = require("../Middleware/authMiddleware.js");

router.post("/create",
  authMiddleware,
  adminMiddleware,
  createSlot
);

router.post("/confirm/:id",
  authMiddleware,
  adminMiddleware,
  confirmBooking
);


// Get slots (public)
router.get("/", getAllSlots);

// User book slot
router.post("/book/:id", authMiddleware, bookSlot);

router.get("/my-bookings", authMiddleware, myBookings);

router.get(
  "/all-bookings",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);


module.exports = router;
