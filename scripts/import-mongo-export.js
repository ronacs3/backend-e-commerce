// Import mongoexport --jsonArray files without requiring MongoDB at runtime.
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { sequelize } = require('../src/config/db');
const { User, Category, Coupon, Product, Order } = require('../src/config/models');
const collections = [['users', User], ['categories', Category], ['coupons', Coupon], ['products', Product], ['orders', Order]];
function decode(value) {
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === 'object') {
    if ('$oid' in value) return value.$oid;
    if ('$date' in value) return new Date(typeof value.$date === 'object' ? Number(value.$date.$numberLong) : value.$date);
    for (const key of ['$numberInt', '$numberLong', '$numberDouble', '$numberDecimal']) {
      if (key in value) return Number(value[key]);
    }
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, decode(entry)]));
  }
  return value;
}
(async () => {
  try {
    const directory = process.argv[2];
    if (!directory) throw new Error('Usage: npm run data:migrate -- <directory-containing-mongoexport-json-files>');
    const datasets = collections.map(([name, Model]) => {
      const file = path.join(directory, name + '.json');
      if (!fs.existsSync(file)) throw new Error('Missing export file: ' + file + ' (use [] for an empty collection)');
      const data = decode(JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')));
      if (!Array.isArray(data)) throw new Error(name + '.json must be a JSON array');
      const fields = Object.keys(Model.rawAttributes);
      return [name, Model, data.map((record) => {
        if (typeof record._id !== 'string' || !/^[a-f0-9]{24}$/i.test(record._id)) throw new Error('Invalid source ID in ' + name);
        return Object.fromEntries(fields.filter((key) => record[key] !== undefined).map((key) => [key, record[key]]));
      })];
    });
    await sequelize.authenticate();
    await sequelize.transaction(async (transaction) => {
      // Never overwrite an existing target database.
      for (const [, Model] of datasets) {
        await sequelize.query('LOCK TABLE ' + sequelize.getQueryInterface().queryGenerator.quoteTable(Model.getTableName()) + ' IN ACCESS EXCLUSIVE MODE', { transaction });
        if (await Model.count({ transaction })) throw new Error('Target tables must be empty; import aborted');
      }
      for (const [name, Model, records] of datasets) {
        // Disable password hooks: exports already contain bcrypt hashes.
        await Model.bulkCreate(records, { transaction, validate: true, hooks: false });
      }
    });
    console.log('Import committed:', datasets.map(([name, , records]) => name + '=' + records.length).join(', '));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await sequelize.close(); }
})();
