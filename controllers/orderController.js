const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");

// @desc    Tạo đơn hàng mới (Full logic: Check kho, Tính giá, Coupon, Trừ kho)
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    couponCode,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Giỏ hàng trống");
  } else {
    // 1. Lấy thông tin Coupon (nếu có)
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expirationDate: { $gte: new Date() }, // Còn hạn
      });
    }

    let dbItemsPrice = 0; // Tổng tiền hàng gốc
    let totalDiscountAmount = 0; // Tổng tiền được giảm
    const productsToUpdate = [];

    // 2. DUYỆT QUA TỪNG SẢN PHẨM ĐỂ TÍNH TIỀN & GIẢM GIÁ
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404);
        throw new Error(`Sản phẩm không tồn tại`);
      }

      // Tính giá dòng sản phẩm này
      const lineItemTotal = product.price * item.qty;
      dbItemsPrice += lineItemTotal;

      // --- LOGIC MỚI: TÍNH GIẢM GIÁ TRÊN TỪNG MÓN ---
      if (coupon) {
        // Điều kiện 1: Mã áp dụng cho tất cả (mảng rỗng)
        const isGlobalCoupon = coupon.applicableCategories.length === 0;

        // Điều kiện 2: Sản phẩm thuộc danh mục cho phép
        const isCategoryMatch = coupon.applicableCategories.includes(
          product.category
        );

        if (isGlobalCoupon || isCategoryMatch) {
          // Tính số tiền giảm cho món này
          const itemDiscount = (lineItemTotal * coupon.discount) / 100;
          totalDiscountAmount += itemDiscount;
        }
      }
      // ----------------------------------------------

      productsToUpdate.push({ product, qty: item.qty });
    }

    // 3. Tính tổng cuối cùng
    const finalTotalPrice =
      dbItemsPrice +
      Number(shippingPrice) +
      Number(taxPrice) -
      totalDiscountAmount;

    // 4. Lưu đơn hàng
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: dbItemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice: finalTotalPrice,
      isPaid: false,
      isDelivered: false,
    });

    const createdOrder = await order.save();

    // 5. Trừ tồn kho
    for (const item of productsToUpdate) {
      const product = item.product;
      product.countInStock -= item.qty;
      await product.save();
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Lấy tất cả đơn hàng
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  // Lấy list order và populate thêm id và name của user mua hàng
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
};

// @desc    Lấy chi tiết 1 đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  // Populate lấy thêm tên và email của người mua từ bảng User
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
};

// @desc    Lấy danh sách đơn hàng của user đang login
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  // Tìm order có field 'user' trùng với ID người đang login
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Cập nhật trạng thái đã giao hàng
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// @desc    Cập nhật trạng thái đã thanh toán (Admin xác nhận thủ công)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    // Ghi chú lại là Admin đã xác nhận
    order.paymentResult = {
      id: req.user._id,
      status: "completed",
      update_time: Date.now(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
};

// @desc    Hủy đơn hàng (User tự hủy hoặc Admin hủy)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Đơn hàng không tồn tại");
  }

  // --- KIỂM TRA QUYỀN SỞ HỮU ---
  // Nếu không phải Admin VÀ cũng không phải chủ đơn hàng -> Chặn
  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Bạn không có quyền hủy đơn hàng này");
  }
  // -----------------------------

  if (order.isDelivered) {
    res.status(400);
    throw new Error("Đơn hàng đang giao hoặc đã giao, không thể hủy!");
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error("Đơn hàng này đã hủy rồi!");
  }

  // Cập nhật trạng thái
  order.isCancelled = true;
  order.cancelledAt = Date.now(); // Ghi lại thời gian hủy
  const updatedOrder = await order.save();

  // HOÀN LẠI TỒN KHO (RESTOCK)
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  res.json({ message: "Đã hủy đơn hàng", order: updatedOrder });
};
module.exports = {
  addOrderItems,
  getOrders,
  getMyOrders,
  updateOrderToDelivered,
  getOrderById,
  updateOrderToPaid,
  cancelOrder,
};
