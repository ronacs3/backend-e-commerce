const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Route gốc: Ai cũng xem được (GET), nhưng chỉ Admin mới được tạo (POST)
router.route("/").get(getProducts).post(protect, admin, createProduct);

// Route theo ID: Ai cũng xem chi tiết được (GET), nhưng chỉ Admin mới được Xóa/Sửa
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;
