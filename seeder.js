const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

const users = require("./data/users");
const products = require("./data/products");
const categories = require("./data/categories");

const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");
const Category = require("./models/categoryModel");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

/* ================= IMPORT DATA ================= */
const importData = async () => {
  try {
    // 1. Clear data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    // 2. Create users (để chạy pre('save') hash password)
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }

    const adminUser = createdUsers[0]._id;

    // 3. Create categories
    const createdCategories = await Category.insertMany(categories);

    // Map category name -> ObjectId
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat.name;
    });

    // 4. Create products (map category string → ObjectId)
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
      category: categoryMap[product.category], // ⭐ FIX CHÍNH
    }));

    await Product.insertMany(sampleProducts);

    console.log("✅ Data Imported Successfully!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse);
    process.exit(1);
  }
};

/* ================= DESTROY DATA ================= */
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log("🔥 Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`❌ ${error}`.red.inverse);
    process.exit(1);
  }
};

/* ================= RUN ================= */
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
