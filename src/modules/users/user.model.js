const { defineModel, DataTypes, requiredString } = require('../../core/database/model');
const bcrypt = require('bcryptjs');
const User = defineModel('User', {
  name: requiredString,
  email: { ...requiredString, unique: true },
  password: requiredString,
  isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  resetPasswordToken: DataTypes.TEXT,
  resetPasswordExpire: DataTypes.DATE,
}, { tableName: 'users', hooks: {
  beforeSave: async (user) => {
    if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
  }
} });
User.prototype.matchPassword = function (password) { return bcrypt.compare(password, this.password); };
module.exports = User;
