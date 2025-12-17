const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
} = require("../controllers/productController");

// Định nghĩa route gốc là /api/products
router.route("/").get(getProducts).post(createProduct);

module.exports = router;
