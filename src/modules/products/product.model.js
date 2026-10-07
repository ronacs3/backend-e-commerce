const { defineModel, DataTypes, requiredString, moneyField } = require('../../core/database/model');
const User = require('../users/user.model');
module.exports = defineModel('Product', {
  user: { type: DataTypes.STRING(24), allowNull: false, references: { model: User, key: '_id' }, onDelete: 'RESTRICT' },
  name: requiredString, image: requiredString, category: requiredString, description: requiredString,
  reviews: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  rating: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
  numReviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  price: { ...moneyField('price'), validate: { min: 0 } },
  countInStock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
}, { tableName: 'products', indexes: [{ fields: ['category'] }] });
