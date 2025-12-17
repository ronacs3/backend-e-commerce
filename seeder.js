const mongoose = require("mongoose");
const dotenv = require("dotenv");
const users = require("./data/users");
const products = require("./data/products");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Xóa dữ liệu cũ
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Thêm Users vào DB
    const createdUsers = await User.insertMany(users);

    // 3. Lấy ID của user đầu tiên (Admin) để gán cho sản phẩm (nếu cần mở rộng sau này)
    const adminUser = createdUsers[0]._id;

    // Map thêm field user vào từng sản phẩm (Optional: Nếu model Product bạn chưa có field user thì nó sẽ bỏ qua)
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // 4. Thêm Products vào DB
    await Product.insertMany(sampleProducts);

    console.log("Đã nhập dữ liệu thành công!");
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Đã xóa sạch dữ liệu!");
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error}`);
    process.exit(1);
  }
};

// Kiểm tra tham số dòng lệnh để chọn chạy hàm nào
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
