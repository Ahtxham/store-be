
const mongoose = require('mongoose');

const mongoConnectionString = process.env.DB_URL || 'mongodb://localhost:27017/storeDB';

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.Promise = global.Promise;
    console.log('\x1b[36m%s\x1b[0m', 'Database connected successfully.');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Database failed to connect.', error);
  }
}

module.exports = { connectToDatabase };