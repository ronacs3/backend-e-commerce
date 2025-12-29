const asyncHandler = require("express-async-handler"); // Import cái này để bắt lỗi tự động
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Category = require("../models/categoryModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
// @desc    Lấy danh sách tất cả danh mục
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.find().distinct("category");
  res.json(categories);
});

// @desc    Lấy tất cả sản phẩm (Có tìm kiếm & Lọc danh mục)
// @route   GET /api/products
// @access  Public
// Backend Controller (Ví dụ)
const getProducts = asyncHandler(async (req, res) => {
  const query = {};

  /* ===== KEYWORD ===== */
  if (req.query.keyword) {
    query.name = {
      $regex: req.query.keyword,
      $options: "i",
    };
  }

  /* ===== CATEGORY (NAME → ObjectId) ===== */
  if (req.query.category) {
    const category = await Category.findOne({
      name: req.query.category,
    });

    if (category) {
      query.category = category.name;
    }
  }

  /* ===== PRICE ===== */
  if (req.query.min || req.query.max) {
    query.price = {};
    if (req.query.min) query.price.$gte = Number(req.query.min);
    if (req.query.max) query.price.$lte = Number(req.query.max);
  }

  const products = await Product.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.json(products);
});
// @desc    Lấy 1 sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // Kiểm tra format ID của MongoDB để tránh lỗi CastError làm crash app
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Không tìm thấy sản phẩm");
    }
  } else {
    res.status(404);
    throw new Error("Sản phẩm không tồn tại (ID không hợp lệ)");
  }
});

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Đã xóa sản phẩm" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }
});

// @desc    Tạo sản phẩm mới (FIX LỖI USER REQUIRED)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Kiểm tra xem User có tồn tại không (Đã qua middleware auth chưa?)
  if (!req.user) {
    res.status(401);
    throw new Error("User không xác định. Vui lòng đăng nhập.");
  }

  const { name, price, image, category, countInStock, description } = req.body;

  const product = new Product({
    name: name || "Tên sản phẩm mới",
    price: price || 0,
    user: req.user._id, // <-- Dòng này gây lỗi nếu req.user undefined
    image: image || "/images/sample.jpg",
    category: category || "Chưa phân loại",
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || "Mô tả sản phẩm...",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }
});

// @desc    Lấy sản phẩm liên quan
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json(relatedProducts);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm gốc");
  }
});

// @desc    Tạo đánh giá mới
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, user } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    // 1. Kiểm tra đã review chưa
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Bạn đã đánh giá sản phẩm này rồi");
    }
    console.log("req.user:", req.user);
    // 2. Kiểm tra đã mua hàng chưa
    const hasPurchased = await Order.findOne({
      user: user._id,
      isPaid: true,
      "orderItems.product": req.params.id,
    });

    if (!hasPurchased) {
      res.status(400);
      throw new Error(
        "Bạn cần mua và thanh toán sản phẩm này để viết đánh giá."
      );
    }

    // 3. Tạo review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Đánh giá đã được thêm" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm");
  }
});

/**
 * @desc    So sánh sản phẩm bằng AI (Gemini)
 * @route   POST /api/products/compare-ai
 * @access  Public
 */
const compareProductsAI = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length < 2) {
    res.status(400);
    throw new Error("Cần ít nhất 2 sản phẩm để so sánh");
  }

  // 1️⃣ Giới hạn số sản phẩm
  const safeProducts = products.slice(0, 4);

  // 2️⃣ Tạo context an toàn (chống XSS)
  const productDetails = safeProducts
    .map((p, index) => {
      return `
Sản phẩm ${index + 1}:
- Tên: ${escape(p.name)}
- Giá: ${Number(p.price).toLocaleString("vi-VN")} VND
- Danh mục: ${escape(p.category)}
- Mô tả: ${escape(p.description || "Không có mô tả")}
- Tồn kho: ${p.countInStock}
`;
    })
    .join("\n");

  // 3️⃣ Prompt rõ ràng – ép Gemini trả HTML thuần
  const prompt = `
Bạn là chuyên gia tư vấn mua sắm.

Hãy so sánh ${safeProducts.length} sản phẩm sau dựa trên dữ liệu được cung cấp:
${productDetails}

YÊU CẦU BẮT BUỘC:
- CHỈ trả về HTML thuần
- KHÔNG markdown
- KHÔNG dùng <html>, <body>
- CHỈ dùng các thẻ: <div>, <p>, <strong>, <ul>, <li>

Cấu trúc:
<div>
  <p><strong>Điểm giống nhau:</strong> ...</p>
  <p><strong>Điểm khác biệt chính:</strong> ...</p>
  <div class="alert">
    <strong>Lời khuyên:</strong> Ai nên mua sản phẩm nào? Vì sao?
  </div>
</div>

Giọng văn khách quan, súc tích, dễ hiểu cho người mua hàng.
`;

  try {
    // 4️⃣ Gọi Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    let html = result.response.text();

    // 5️⃣ Phòng trường hợp Gemini bọc ```html
    html = html.replace(/```html|```/g, "").trim();

    res.json({ result: html });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500);
    throw new Error("Lỗi khi gọi Gemini AI so sánh sản phẩm");
  }
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getRelatedProducts,
  createProductReview,
  getProductCategories,
  compareProductsAI,
};
