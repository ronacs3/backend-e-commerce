const Order = require("../models/orderModel");

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private (Cần đăng nhập)
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "Giỏ hàng rỗng" });
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, // Lấy ID từ token người dùng đang đăng nhập
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save(); // Lưu vào DB

    res.status(201).json(createdOrder);
  }
};

// @desc    Lấy tất cả đơn hàng
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  // Lấy list order và populate thêm id và name của user mua hàng
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
};

// @desc    Lấy danh sách đơn hàng của user đang login
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  // Tìm order có field 'user' trùng với ID người đang login
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

module.exports = { addOrderItems, getOrders, getMyOrders };
