const mongoose = require("mongoose");

let isConnected = false;

async function connectDB(uri) {
  if (isConnected) return mongoose.connection;
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
