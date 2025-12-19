const express = require("express");
const router = express.Router();
const {
  createCoupon,
  validateCoupon,
  getCoupons,
  deleteCoupon,
} = require("../controllers/couponController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, admin, createCoupon) // Tạo
  .get(protect, admin, getCoupons); // Lấy danh sách (MỚI)

router.route("/:id").delete(protect, admin, deleteCoupon); // Xóa (MỚI)

router.post("/validate", validateCoupon);

module.exports = router;
