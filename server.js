const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

// --- 1. QUAN TRỌNG: Cấu hình dotenv ĐẦU TIÊN ---
// Phải chạy dòng này trước khi import các file khác để load biến môi trường
dotenv.config();

const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// Import Swagger & Middleware
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Kết nối DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- 2. Routes ---
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/upload", uploadRoutes);

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- 3. QUAN TRỌNG: Cấu hình thư mục uploads ---
// Phải đặt TRƯỚC middleware lỗi (notFound)
// Dùng path.resolve() để tránh lỗi __dirname nếu có cấu hình module khác
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")));

// --- 4. Middleware xử lý lỗi (Luôn đặt CUỐI CÙNG) ---
app.use(notFound); // Chặn route không tồn tại
app.use(errorHandler); // Xử lý lỗi JSON

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
