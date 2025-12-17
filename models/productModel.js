const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true }, // Tạm thời lưu URL ảnh
  },
  {
    timestamps: true, // Tự động tạo field createdAt, updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);
