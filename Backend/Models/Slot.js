const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
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
      enum: ["available", "pending", "booked", "cancelled"],
      default: "available"
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    bookingNumber: {
      type: String,
      default: null
    },
    requestCode: {
      type: String,
      default: null
    }
    ,
    price: {
      type: Number,
      required: true
    },

    offlineCustomer: {
      name: String,
      mobile: String
    },
    paymentType: {
      type: String,
      enum: ["online", "cash"],
      default: null
    },



  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);
