const { defineModel, DataTypes, requiredString } = require('../../core/database/model');
module.exports = defineModel('Category', {
  name: { ...requiredString, unique: true }, description: DataTypes.TEXT, image: DataTypes.TEXT,
}, { tableName: 'categories' });
