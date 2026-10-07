const { Sequelize } = require('sequelize');
require('dotenv').config();
const options = { dialect: 'postgres', logging: false,
  dialectOptions: process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: true } } : {} };
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, options)
  : new Sequelize(process.env.DB_NAME || 'ecommerce', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || '', {
      ...options, host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 5432) });
const connectDB = async () => {
  await sequelize.authenticate();
  console.log('PostgreSQL connected');
};
module.exports = connectDB;
module.exports.sequelize = sequelize;
