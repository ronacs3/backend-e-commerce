const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

// @desc    Tạo danh mục mới
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, description, image } = req.body;

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Danh mục đã tồn tại");
  }

  const category = await Category.create({ name, description, image });
  res.status(201).json(category);
};

// @desc    Lấy tất cả danh mục
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

// @desc    Cập nhật danh mục
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    category.image = req.body.image || category.image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }
};

// @desc    Xóa danh mục
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // Kiểm tra xem có sản phẩm nào đang dùng danh mục này không?
    // Lưu ý: Hiện tại Product.category của bạn đang lưu String (tên).
    // Nếu sau này đổi sang lưu ID, bạn sửa query bên dưới thành { category: category._id }
    const productsUsing = await Product.findOne({ category: category.name });

    if (productsUsing) {
      res.status(400);
      throw new Error("Không thể xóa! Có sản phẩm đang thuộc danh mục này.");
    }

    await Category.deleteOne({ _id: category._id });
    res.json({ message: "Đã xóa danh mục" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }
};

// @desc    Lấy chi tiết danh mục kèm danh sách sản phẩm
// @route   GET /api/categories/:id
// @access  Public
const getCategoryDetails = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Tìm các sản phẩm có category trùng tên với category này
  // (Logic này dựa trên việc Product đang lưu tên category dạng string)
  const products = await Product.find({ category: category.name });

  res.json({
    ...category._doc,
    products: products, // Trả về thông tin danh mục + list sản phẩm
  });
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
};
