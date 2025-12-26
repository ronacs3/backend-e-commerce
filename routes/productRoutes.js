const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  getRelatedProducts,
  createProductReview,
  getProductCategories,
  compareProductsAI, // <--- Đừng quên import hàm này (đã làm ở các bước trước)
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// 1. Route gốc: Lấy tất cả & Tạo mới
router.route("/").get(getProducts).post(protect, admin, createProduct); // Đã có protect (lấy req.user) và admin (check quyền)

// 2. Route lấy danh sách danh mục (QUAN TRỌNG: Phải đặt trước /:id)
// Nếu đặt sau, code sẽ tưởng "categories" là một cái ID sản phẩm
router.route("/categories").get(getProductCategories);

// 3. Các route con cụ thể của sản phẩm
router.route("/:id/related").get(getRelatedProducts);
router.route("/:id/reviews").post(protect, createProductReview);
router.route("/compare-ai").post(compareProductsAI);
// 4. Route theo ID (Luôn đặt cuối cùng trong nhóm)
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
