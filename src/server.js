const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

// 1. Config dotenv ngay đầu tiên
dotenv.config();

const connectDB = require("./config/db");
const cors = require("cors");
const { notFound, errorHandler } = require("./core/middleware/errorMiddleware");

// Import Routes
const productRoutes = require("./modules/products/product.routes");
const userRoutes = require("./modules/users/user.routes");
const orderRoutes = require("./modules/orders/order.routes");
const categoryRoutes = require("./modules/categories/category.routes");
const couponRoutes = require("./modules/coupons/coupon.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
// >>> THÊM DÒNG NÀY <<<
const chatRoutes = require("./modules/chat/chat.routes");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://techshopnibi.name.vn", // <--- THÊM DÒNG NÀY
    ],
    credentials: true,
  })
);
app.use(express.json());

// 2. Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/upload", uploadRoutes);
// >>> GẮN ROUTE CHAT VÀO ĐÂY <<<
app.use("/api/chat", chatRoutes);

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Static folder
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")));

// 3. Error Handler (Luôn ở cuối)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
