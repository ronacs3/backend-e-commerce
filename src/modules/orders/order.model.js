const { defineModel, DataTypes, requiredString, moneyField } = require('../../core/database/model');
const User = require('../users/user.model');
const Order = defineModel('Order', {
  user: { type: DataTypes.STRING(24), allowNull: false, references: { model: User, key: '_id' }, onDelete: 'RESTRICT' },
  orderItems: { type: DataTypes.JSONB, allowNull: false },
  shippingAddress: { type: DataTypes.JSONB, allowNull: false,
    validate: { complete(value) { for (const key of ['address', 'city', 'postalCode', 'country']) {
      if (!value || typeof value[key] !== 'string' || !value[key].trim()) throw new Error('Shipping address requires ' + key);
    } } } },
  paymentMethod: requiredString, paymentResult: DataTypes.JSONB,
  itemsPrice: moneyField('itemsPrice'), taxPrice: moneyField('taxPrice'),
  shippingPrice: moneyField('shippingPrice'), totalPrice: moneyField('totalPrice'),
  isPaid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, paidAt: DataTypes.DATE,
  isDelivered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, deliveredAt: DataTypes.DATE,
  isCancelled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, cancelledAt: DataTypes.DATE,
}, { tableName: 'orders', indexes: [{ fields: ['user'] }, { fields: ['createdAt'] }] });
Order.belongsTo(User, { as: 'buyer', foreignKey: 'user', targetKey: '_id' });
module.exports = Order;
