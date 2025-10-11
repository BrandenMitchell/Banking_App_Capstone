// entry point for backend server
require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/dbConfig.js");
const cors = require('cors');
const app = express();

dotenv.config(); //load in .env variables
connectDB();



//routes here
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./middleware/auth');
//routes end
app.use(cors());
app.use(express.json());
app.use('/api/users',userRoutes); //use userRoutes when accessing api/user/
app.use('/api/auth', authRoutes);

// health route shows DB connection state
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({ ok: mongoose.connection.readyState === 1, dbState: mongoose.connection.readyState });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
