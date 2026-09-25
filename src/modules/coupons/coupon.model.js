const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    // --- MỚI: DANH SÁCH DANH MỤC ÁP DỤNG ---
    // Ví dụ: ["Giày dép", "Áo thun"]. Nếu rỗng [] -> Áp dụng hết.
    applicableCategories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
