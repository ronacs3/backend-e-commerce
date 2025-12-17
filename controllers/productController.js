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

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Đã xóa sản phẩm" });
  } else {
    res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }
};

// @desc    Tạo sản phẩm mẫu (Admin bấm nút "Tạo" sẽ sinh ra 1 cái mẫu để sửa)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const product = new Product({
    name: "Tên sản phẩm mẫu",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    category: "Danh mục mẫu",
    countInStock: 0,
    description: "Mô tả sản phẩm...",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }
};

// @desc    Lấy 1 sản phẩm theo ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    // Lỗi khi ID không đúng định dạng MongoDB
    res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
