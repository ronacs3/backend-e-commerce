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

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};
