const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

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

module.exports = { registerUser, authUser, getUserProfile };
