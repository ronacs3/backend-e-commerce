const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrders,
  getMyOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// Chỉ user đã đăng nhập (có token) mới post được vào đây
router.route("/").post(protect, addOrderItems);
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);

module.exports = router;
