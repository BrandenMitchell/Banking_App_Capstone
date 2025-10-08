// entry point for backend server
require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");

const app = express();

const { MONGODB_URI, PORT = 5000 } = process.env;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");
connectDB(MONGODB_URI);

// health route shows DB connection state
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({ ok: mongoose.connection.readyState === 1, dbState: mongoose.connection.readyState });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
