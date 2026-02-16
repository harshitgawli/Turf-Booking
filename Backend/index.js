const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// app.use(cors());
app.use(cors({
  origin: ["http://localhost:5173", "https://turf-booking-beryl.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./Routes/userRoutes.js"));
app.use("/api/slots", require("./Routes/slotRoutes.js"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log("Server running on 5000")
    );
  })
  .catch(err => console.log(err));
