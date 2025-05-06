const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const parkingRoutes = require("./routes/parkingRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(express.json());

app.use("/api/parking", parkingRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
