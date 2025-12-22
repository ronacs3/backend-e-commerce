const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

// @desc    Đăng ký người dùng mới
// @route   POST /api/users
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "Email đã tồn tại" });
  }

  const user = await User.create({
    name,
    email,
    password, // Mật khẩu sẽ tự động được mã hóa nhờ model
  });

  if (user) {
    // --- GỬI MAIL CHÀO MỪNG ---
    try {
      await sendEmail({
        email: user.email,
        subject: "Chào mừng đến với E-Commerce Shop!",
        html: `<h3>Xin chào ${user.name},</h3>
                 <p>Cảm ơn bạn đã đăng ký tài khoản. Chúc bạn mua sắm vui vẻ!</p>`,
      });
    } catch (error) {
      console.error("Lỗi gửi mail:", error);
    }
    // --------------------------
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Trả về token ngay khi đăng ký
    });
  } else {
    res.status(400).json({ message: "Dữ liệu không hợp lệ" });
  }
};

// @desc    Đăng nhập & Lấy Token
// @route   POST /api/users/login
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Kiểm tra email và mật khẩu
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Email hoặc mật khẩu sai" });
  }
};

// @desc    Lấy thông tin cá nhân (Profile)
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  // req.user đã có nhờ middleware 'protect'
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: "Không tìm thấy user" });
  }
};

// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Xóa user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Không thể xóa tài khoản Admin"); // Bảo vệ Admin không bị xóa
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "Đã xóa người dùng" });
  } else {
    res.status(404).json({ message: "Không tìm thấy người dùng" });
  }
};

// @desc    Cập nhật hồ sơ cá nhân
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Nếu có gửi password mới thì mới cập nhật
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Trả về dữ liệu mới (kèm token cũ để client cập nhật Redux)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Quên mật khẩu (Gửi link reset)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy Email này");
  }

  // Tạo token reset ngẫu nhiên
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token để lưu vào DB (Bảo mật)
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

  await user.save();

  // Tạo link reset (Trỏ về Frontend)
  // Ví dụ Frontend chạy localhost:3000
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
      <h1>Yêu cầu đặt lại mật khẩu</h1>
      <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>Link này sẽ hết hạn sau 10 phút.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Đặt lại mật khẩu E-Commerce",
      html: message,
    });

    res.json({ success: true, data: "Đã gửi email hướng dẫn!" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error("Không thể gửi email");
  }
});

// @desc    Đặt lại mật khẩu mới
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // 1. Hash token từ URL để so sánh với token trong DB
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2. Tìm user có token đó và chưa hết hạn
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }

  // 3. Cập nhật mật khẩu mới
  user.password = req.body.password;

  // 4. Xóa token reset đi
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // 5. Lưu lại (Middleware pre-save sẽ tự hash password mới)
  await user.save();

  res.json({ message: "Đổi mật khẩu thành công" });
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
};
