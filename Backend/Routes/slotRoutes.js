const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware.js");
const adminMiddleware = require("../Middleware/adminMiddleware.js");

const {
  createSlot,
  getAllSlots,
  bookSlot,
  confirmBooking,
  cancelBooking,
  myBookings,
  getAllBookings,
  getPendingBookings
} = require("../Controllers/slotControllers.js");


// -------------------- ADMIN ROUTES --------------------

// Create slot
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createSlot
);

// Confirm booking
router.post(
  "/confirm/:id",
  authMiddleware,
  adminMiddleware,
  confirmBooking
);

// Cancel booking
router.post(
  "/cancel/:id",
  authMiddleware,
  adminMiddleware,
  cancelBooking
);

// View all bookings
router.get(
  "/all-bookings",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);

//view pending bookings
router.get(
  "/pending",
  authMiddleware,
  adminMiddleware,
  getPendingBookings
);


// -------------------- USER ROUTES --------------------

// Get all slots (public)
router.get("/", getAllSlots);

// Book slot (pending state)
router.post(
  "/book/:id",
  authMiddleware,
  bookSlot
);

// My confirmed bookings
router.get(
  "/my-bookings",
  authMiddleware,
  myBookings
);


module.exports = router;
