// Middleware xử lý khi sai đường dẫn (Not Found)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware xử lý lỗi chung (Error Handler)
const errorHandler = (err, req, res, next) => {
  // Nếu status code đang là 200 thì đổi thành 500 (lỗi server), còn không giữ nguyên
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  res.json({
    message: err.message, // <--- ĐÂY LÀ CÁI FRONTEND CẦN
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Chỉ hiện stack trace khi dev
  });
};

module.exports = { notFound, errorHandler };
