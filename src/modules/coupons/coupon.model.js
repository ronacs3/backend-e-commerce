const { defineModel, DataTypes, requiredString } = require('../../core/database/model');
module.exports = defineModel('Coupon', {
  code: { ...requiredString, unique: true, set(value) { this.setDataValue('code', value.toUpperCase()); } },
  discount: { type: DataTypes.DOUBLE, allowNull: false, validate: { min: 0, max: 100 } },
  expirationDate: { type: DataTypes.DATE, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  applicableCategories: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false, defaultValue: [] },
}, { tableName: 'coupons' });
