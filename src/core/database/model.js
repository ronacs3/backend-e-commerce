const { DataTypes } = require('sequelize');
const { randomBytes } = require('crypto');
const { sequelize } = require('../../config/db');
const defineModel = (name, attributes, options = {}) => sequelize.define(name, {
  _id: { type: DataTypes.STRING(24), primaryKey: true, defaultValue: () => randomBytes(12).toString('hex') },
  ...Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, value && typeof value === 'object' && 'type' in value ? { ...value } : value])),
}, { timestamps: true, ...options });
const requiredString = { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } };
const money = { type: DataTypes.DECIMAL(18, 2), allowNull: false, defaultValue: 0 };
// Monetary getters are installed per field to keep API values numeric.
const moneyField = (field) => ({ ...money, get() { return Number(this.getDataValue(field)); } });
module.exports = { defineModel, DataTypes, requiredString, moneyField };

