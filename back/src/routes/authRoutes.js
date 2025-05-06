const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, idUniversity, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      idUniversity,
      role
    });
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, "secret", { expiresIn: "1h" });
  res.json({ token, role: user.role });
});

// Change role (guard only)
router.patch("/changerole/:id", async (req, res) => {
  const roleHeader = req.header("x-role");
  if (roleHeader !== "guard") {
    return res.status(403).json({ error: "Only guards can change roles" });
  }

  const { role } = req.body;
  const validRoles = ["user", "guard"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!updated) return res.status(404).json({ error: "User not found" });

  res.json({ message: "Role updated", user: updated });
});

module.exports = router;
