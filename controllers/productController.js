const Product = require("../models/productModel");

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// @desc    Tạo một sản phẩm mẫu
// @route   POST /api/products
const createProduct = async (req, res) => {
  const { name, price, description, category, countInStock, image } = req.body;

  try {
    const product = new Product({
      name,
      price,
      description,
      category,
      countInStock,
      image,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Dữ liệu không hợp lệ", error: error.message });
  }
};

module.exports = { getProducts, createProduct };
