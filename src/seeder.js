require('dotenv').config();
const connectDB = require('./config/db');
const { User, Product, Order, Category, Coupon } = require('./config/models');
const users = require('./data/users');
const products = require('./data/products');
const categories = require('./data/categories');
(async () => {
  try {
    await connectDB();
    await connectDB.sequelize.transaction(async (transaction) => {
      for (const Model of [Order, Product, Coupon, User, Category]) await Model.destroy({ where: {}, transaction });
      if (process.argv[2] !== '-d') {
        const createdUsers = [];
        for (const user of users) createdUsers.push(await User.create(user, { transaction }));
        await Category.bulkCreate(categories, { transaction, validate: true });
        await Product.bulkCreate(products.map((product) => ({ ...product, user: createdUsers[0]._id })), { transaction, validate: true });
      }
    });
    console.log(process.argv[2] === '-d' ? 'Data destroyed' : 'Data imported');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await connectDB.sequelize.close(); }
})();
