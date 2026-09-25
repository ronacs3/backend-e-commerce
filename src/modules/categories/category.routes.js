const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
} = require("./category.controller");
const { protect, admin } = require("../../core/middleware/authMiddleware");

router.route("/").get(getCategories).post(protect, admin, createCategory);

router
  .route("/:id")
  .get(getCategoryDetails) // Xem chi tiết + list sản phẩm
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
