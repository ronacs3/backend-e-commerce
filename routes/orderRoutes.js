const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrders,
  getMyOrders,
  updateOrderToDelivered,
  getOrderById,
  updateOrderToPaid,
  cancelOrder,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// 1. Route gốc (Tạo đơn, Lấy tất cả đơn)
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

// 2. Route lấy đơn của tôi (QUAN TRỌNG: Phải đặt TRƯỚC route /:id)
router.route("/myorders").get(protect, getMyOrders);

// Route thống kê (Đặt trước route /:id để tránh conflict)
router.route("/stats").get(protect, admin, getOrderStats);

// 3. Route lấy chi tiết theo ID (Đặt CUỐI CÙNG vì nó nhận mọi chuỗi ký tự)
router.route("/:id").get(protect, getOrderById);

// 4. Route giao hàng
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id/pay").put(protect, admin, updateOrderToPaid);
router.route("/:id/cancel").put(protect, cancelOrder);

module.exports = router;
