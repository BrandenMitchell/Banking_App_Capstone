// entry point for backend server
require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/dbConfig.js");
const cors = require('cors');
const app = express();
dotenv.config();

const PORT =process.env.PORT;
// Try to connect to DB if MONGODB_URI is set, otherwise skip to allow server start
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn("MONGODB_URI not set; starting server without DB connection.");
}



//routes here
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./middleware/auth');
const budgetRoutes = require('./routes/budgetRoutes');
// routes end
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes); // use userRoutes when accessing api/user/
app.use('/api/auth', authRoutes);
app.use('/api/budget', budgetRoutes);

// health route shows DB connection state
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({ ok: mongoose.connection.readyState === 1, dbState: mongoose.connection.readyState });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
