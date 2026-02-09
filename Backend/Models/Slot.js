const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  status: {
  type: String,
  enum: ["available", "booked"],
  default: "available"
},

  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
});

module.exports = mongoose.model("Slot", slotSchema);
