const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../users/user.model');
const Order = require("./order.model");
const Product = require("../products/product.model");
const asyncHandler = require("express-async-handler");
const Coupon = require("../coupons/coupon.model");
const sendEmail = require("../../core/utils/sendEmail");

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

  if (!Array.isArray(orderItems) || !orderItems.length) {
    res.status(400); throw new Error('Giỏ hàng trống');
  }
  const quantities = new Map();
  for (const item of orderItems) {
    if (typeof item.product !== 'string' || !Number.isInteger(item.qty) || item.qty <= 0) {
      res.status(400); throw new Error('Sản phẩm hoặc số lượng không hợp lệ');
    }
    quantities.set(item.product, (quantities.get(item.product) || 0) + item.qty);
  }
  const shipping = Number(shippingPrice ?? 0), tax = Number(taxPrice ?? 0);
  if (![shipping, tax].every((v) => Number.isFinite(v) && v >= 0)) {
    res.status(400); throw new Error('Phí vận chuyển hoặc thuế không hợp lệ');
  }
  const createdOrder = await sequelize.transaction(async (transaction) => {
    const coupon = couponCode ? await Coupon.findOne({ where: {
      code: couponCode.toUpperCase(), isActive: true, expirationDate: { [Op.gte]: new Date() },
    }, transaction }) : null;
    let itemsPrice = 0, discount = 0;
    const storedItems = [];
    // Lock in a fixed order to prevent overselling and reduce deadlocks.
    for (const [id, qty] of [...quantities.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      const product = await Product.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!product) { res.status(404); throw new Error('Sản phẩm không tồn tại'); }
      if (product.countInStock < qty) { res.status(400); throw new Error('Sản phẩm không đủ tồn kho'); }
      const lineTotal = product.price * qty;
      itemsPrice += lineTotal;
      if (coupon && (!coupon.applicableCategories.length || coupon.applicableCategories.includes(product.category))) {
        discount += lineTotal * coupon.discount / 100;
      }
      storedItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, qty });
      product.countInStock -= qty;
      await product.save({ transaction });
    }
    return Order.create({ user: req.user._id, orderItems: storedItems, shippingAddress, paymentMethod,
      itemsPrice, taxPrice: tax, shippingPrice: shipping, totalPrice: itemsPrice + tax + shipping - discount,
    }, { transaction });
  });
    if (createdOrder) {
      // Tạo bảng danh sách sản phẩm bằng HTML
      const itemsHtml = createdOrder.orderItems
        .map(
          (item) => `
          <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.name
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.qty}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.price.toLocaleString(
                "vi-VN"
              )} đ</td>
          </tr>
      `
        )
        .join("");

      const emailContent = `
          <h2>Cảm ơn bạn đã đặt hàng!</h2>
          <p>Mã đơn hàng: <strong>${createdOrder._id}</strong></p>
          <table style="border-collapse: collapse; width: 100%;">
              <thead>
                  <tr style="background-color: #f2f2f2;">
                      <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Giá</th>
                  </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
          </table>
          <h3>Tổng tiền: ${createdOrder.totalPrice.toLocaleString(
            "vi-VN"
          )} đ</h3>
          <p>Chúng tôi sẽ sớm giao hàng cho bạn.</p>
      `;

      try {
        // Lấy email user từ req.user (vì đã qua middleware auth)
        await sendEmail({
          email: req.user.email,
          subject: `Xác nhận đơn hàng #${createdOrder._id}`,
          html: emailContent,
        });
      } catch (error) {
        console.error("Lỗi gửi mail đơn hàng:", error);
      }
    }
    res.status(201).json(createdOrder);
});

// @desc    Lấy tất cả đơn hàng
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  // Lấy list order và populate thêm id và name của user mua hàng
  const orders = await Order.findAll({ include: [{ model: User, as: 'buyer', attributes: ['_id', 'name'] }] });
  res.json(orders.map((order) => { const value = order.get({ plain: true }); if (value.buyer) { value.user = value.buyer; delete value.buyer; } return value; }));
};

// @desc    Lấy chi tiết 1 đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  // Populate lấy thêm tên và email của người mua từ bảng User
  const order = await Order.findByPk(req.params.id, { include: [{ model: User, as: 'buyer', attributes: ['_id', 'name', 'email'] }] });

  if (order) {
    const value = order.get({ plain: true }); value.user = value.buyer; delete value.buyer; res.json(value);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
};

// @desc    Lấy danh sách đơn hàng của user đang login
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Chưa đăng nhập");
  }

  const orders = await Order.findAll({ where: { user: req.user._id } });
  res.json(orders);
});

// @desc    Cập nhật trạng thái đã giao hàng
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    // --- GỬI MAIL THÔNG BÁO GIAO HÀNG ---
    try {
      await sendEmail({
        email: (await User.findByPk(order.user)).email,
        subject: `Đơn hàng #${order._id} đã được giao thành công`,
        html: `<h3>Xin chào ${(await User.findByPk(order.user)).name},</h3>
                 <p>Đơn hàng <strong>${order._id}</strong> của bạn đã được giao thành công.</p>
                 <p>Hãy đánh giá sản phẩm để nhận ưu đãi cho lần mua tiếp theo nhé!</p>`,
      });
    } catch (error) {
      console.error(error);
    }
    // ------------------------------------
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
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();

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
  const updatedOrder = await sequelize.transaction(async (transaction) => {
    const order = await Order.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!order) { res.status(404); throw new Error('Đơn hàng không tồn tại'); }
    if (!req.user.isAdmin && order.user !== req.user._id) {
      res.status(401); throw new Error('Bạn không có quyền hủy đơn hàng này');
    }
    if (order.isDelivered || order.isCancelled) { res.status(400); throw new Error('Đơn hàng không thể hủy'); }
    for (const item of [...order.orderItems].sort((a, b) => a.product.localeCompare(b.product))) {
      const product = await Product.findByPk(item.product, { transaction, lock: transaction.LOCK.UPDATE });
      if (product) { product.countInStock += item.qty; await product.save({ transaction }); }
    }
    order.isCancelled = true; order.cancelledAt = new Date();
    return order.save({ transaction });
  });
  res.json({ message: 'Đã hủy đơn hàng', order: updatedOrder });
};

const getOrderStats = asyncHandler(async (req, res) => {
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const dailyOrders = await sequelize.query(
    `SELECT to_char("createdAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS "_id",
      SUM("totalPrice")::float8 AS "totalSales", COUNT(*)::int AS "count"
      FROM orders WHERE "createdAt" >= :since GROUP BY 1 ORDER BY 1`,
    { replacements: { since: last7Days }, type: QueryTypes.SELECT });
  const statusStats = await sequelize.query(
    'SELECT "isPaid" AS "_id", COUNT(*)::int AS "count" FROM orders GROUP BY "isPaid"',
    { type: QueryTypes.SELECT });
  const topProducts = await sequelize.query(
    `SELECT item->>'product' AS "_id", MIN(item->>'name') AS "name",
      SUM((item->>'qty')::int)::int AS "totalQty"
      FROM orders CROSS JOIN LATERAL jsonb_array_elements("orderItems") AS item
      GROUP BY item->>'product' ORDER BY "totalQty" DESC LIMIT 5`,
    { type: QueryTypes.SELECT });

  res.json({ dailyOrders, statusStats, topProducts });
});
module.exports = { addOrderItems, getOrders, getMyOrders, updateOrderToDelivered, getOrderById, updateOrderToPaid, cancelOrder, getOrderStats };
