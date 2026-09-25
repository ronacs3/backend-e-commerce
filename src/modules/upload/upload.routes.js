const path = require("path");
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const router = express.Router();

// 1. Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cấu hình Multer (Lưu tạm vào thư mục uploads/)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Đảm bảo bạn đã tạo thư mục này ở root
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Kiểm tra định dạng file
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Chỉ chấp nhận file ảnh!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 3. API Upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "my-ecommerce-shop", // Tên folder trên Cloudinary
      use_filename: true,
    });

    // Xóa file tạm trong thư mục uploads sau khi upload xong
    fs.unlinkSync(req.file.path);

    // Trả về URL ảnh
    res.send({
      message: "Image uploaded",
      image: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Upload failed" });
  }
});

module.exports = router;
