require('dotenv').config();
const connectDB = require('../../config/db');
require('../../config/models');
(async () => {
  try { await connectDB(); await connectDB.sequelize.sync(); console.log('PostgreSQL tables ready'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { await connectDB.sequelize.close(); }
})();
