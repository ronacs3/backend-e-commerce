const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header có gửi kèm token dạng "Bearer abcxyz..." không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Lấy token từ chuỗi "Bearer <token>"

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token

      // Tìm user tương ứng với token và gắn vào req.user (trừ field password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Cho phép đi tiếp
    } catch (error) {
      res.status(401).json({ message: "Không có quyền truy cập, token sai" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có quyền truy cập, thiếu token" });
  }
};

module.exports = { protect };
