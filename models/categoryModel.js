const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Tên danh mục không được trùng
    },
    description: {
      type: String,
    },
    // Nếu bạn muốn danh mục có ảnh đại diện
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
