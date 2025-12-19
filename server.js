const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

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
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(notFound); // Chặn các route không tồn tại
app.use(errorHandler); // Chuyển đổi mọi lỗi thành JSON

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
