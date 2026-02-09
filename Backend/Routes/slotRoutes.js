const express = require("express");
const router = express.Router();
const adminMiddleware = require("../Middleware/adminMiddleware.js");
const authMiddleware = require("../Middleware/authMiddleware.js");

const {
  createSlot,
  getAllSlots,
  myBookings,
  getAllBookings,
  createOrder,
  verifyPayment
} = require("../Controllers/slotControllers.js");



router.post("/create",
  authMiddleware,
  adminMiddleware,
  createSlot
);
// Get slots (public)
router.get("/", getAllSlots);



router.get("/my-bookings", authMiddleware, myBookings);

router.get(
  "/all-bookings",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);


router.post("/create-order/:id", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);



module.exports = router;
