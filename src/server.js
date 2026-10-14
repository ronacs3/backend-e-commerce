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

// Kết nối DB cho môi trường local
if (!process.env.VERCEL) {
  connectDB();
}

const app = express();

// Middleware đảm bảo kết nối DB trước khi xử lý API (cần thiết cho Vercel Serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi kết nối cơ sở dữ liệu (Database connection failed)",
      error: err.message,
      hint: "Hãy kiểm tra biến môi trường MONGO_URI trên Vercel và cấu hình Network Access (0.0.0.0/0) trên MongoDB Atlas.",
    });
  }
});

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://techshopnibi.name.vn",
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép nếu không có origin (Postman, mobile, same-origin) hoặc origin nằm trong danh sách hoặc domain vercel
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// Trang chủ API
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "TechShop E-commerce API is running!",
    docs: "/api-docs",
  });
});

// 2. Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/upload", uploadRoutes);
// >>> GẮN ROUTE CHAT VÀO ĐÂY <<<
app.use("/api/chat", chatRoutes);

// Swagger Docs (kèm CDN CSS/JS để hoạt động tốt trên Vercel)
const swaggerOptions = {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js",
  ],
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));

// Static folder
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")));

// 3. Error Handler (Luôn ở cuối)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
