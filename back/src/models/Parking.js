const mongoose = require("mongoose");

const ParkingSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  spotNumber: String,
  assignedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Parking", ParkingSchema);
