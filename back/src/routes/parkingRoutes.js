const express = require("express");
const Parking = require("../models/Parking");
const User = require("../models/User");
const { authorizeRole } = require("../middleware/auth");

const router = express.Router();

// Guard assigns parking
router.post("/assign", authorizeRole("guard"), async (req, res) => {
  const { studentId, spotNumber } = req.body;
  const student = await User.findById(studentId);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const assignment = new Parking({ student: studentId, spotNumber });
  await assignment.save();
  res.status(201).json(assignment);
});

// Users view their assigned parking
router.get("/my-parking", authorizeRole("user"), async (req, res) => {
  const studentId = req.header("x-user-id");
  const assigned = await Parking.findOne({ student: studentId }).populate("student");
  if (!assigned) return res.status(404).json({ error: "No parking assigned" });
  res.json(assigned);
});

module.exports = router;
