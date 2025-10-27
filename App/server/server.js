// entry point for backend server
require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/dbConfig.js");
const cors = require('cors');
const app = express();
dotenv.config();

const PORT = process.env.PORT;
connectDB();



//routes here
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
//routes end
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true,               // if you need cookies
}));
app.use(express.json());



app.use('/api/users',userRoutes); 
app.use('/api/auth', authRoutes);

// health route shows DB connection state
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({ ok: mongoose.connection.readyState === 1, dbState: mongoose.connection.readyState });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
