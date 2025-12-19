const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");

// @desc    Tạo mã giảm giá mới
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  // 1. Nhận thêm applicableCategories từ req.body
  const { code, discount, expirationDate, applicableCategories } = req.body;

  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    res.status(400);
    throw new Error("Mã giảm giá này đã tồn tại");
  }

  // 2. Lưu vào Database
  const coupon = await Coupon.create({
    code,
    discount,
    expirationDate,
    // Nếu không gửi lên (undefined/null) thì mặc định là mảng rỗng [] (Áp dụng tất cả)
    applicableCategories: applicableCategories || [],
  });

  res.status(201).json(coupon);
});

// @desc    Kiểm tra mã giảm giá (Trả về cả danh mục áp dụng)
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
  // 1. Nhận thêm cartItems từ Frontend
  const { code, cartItems } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (coupon && coupon.isActive) {
    // 2. Kiểm tra hết hạn
    if (new Date() > coupon.expirationDate) {
      res.status(400);
      throw new Error("Mã giảm giá đã hết hạn");
    }

    // 3. LOGIC MỚI: Kiểm tra danh mục áp dụng
    // Nếu mã này có giới hạn danh mục (mảng không rỗng)
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      // Kiểm tra xem giỏ hàng có rỗng không hoặc không có category
      if (!cartItems || cartItems.length === 0) {
        res.status(400);
        throw new Error("Giỏ hàng trống, không thể áp dụng mã");
      }

      // Tìm xem trong giỏ hàng có sản phẩm nào khớp danh mục không
      // Giả sử cartItems từ frontend gửi lên có trường 'category'
      const hasMatchingItem = cartItems.some((item) =>
        coupon.applicableCategories.includes(item.category)
      );

      if (!hasMatchingItem) {
        res.status(400);
        // Thông báo rõ ràng mã này chỉ dùng cho loại nào
        throw new Error(
          `Mã này chỉ áp dụng cho sản phẩm thuộc danh mục: ${coupon.applicableCategories.join(
            ", "
          )}`
        );
      }
    }

    // Nếu thỏa mãn hết thì trả về
    res.json({
      code: coupon.code,
      discount: coupon.discount,
      applicableCategories: coupon.applicableCategories || [],
    });
  } else {
    res.status(404);
    throw new Error("Mã giảm giá không hợp lệ");
  }
});

// @desc    Lấy tất cả mã giảm giá
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }); // Mới nhất lên đầu
  res.json(coupons);
});

// @desc    Xóa mã giảm giá
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await Coupon.deleteOne({ _id: coupon._id });
    res.json({ message: "Đã xóa mã giảm giá" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy mã");
  }
});

module.exports = { createCoupon, validateCoupon, getCoupons, deleteCoupon };
