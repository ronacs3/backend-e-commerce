const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("LỖI: Biến môi trường MONGO_URI chưa được cấu hình!");
    throw new Error("MONGO_URI environment variable is missing.");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Không dùng process.exit(1) trên Vercel Serverless vì sẽ làm sập container
    throw error;
  }
};

module.exports = connectDB;
