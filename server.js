const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

// Cấu hình
dotenv.config();
connectDB(); // Kết nối DB

const app = express();

// Middleware
app.use(cors()); // Cho phép frontend gọi
app.use(express.json()); // Cho phép đọc JSON từ body request

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
