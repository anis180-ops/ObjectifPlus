const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try direct connection first
    const conn = await mongoose.connect(process.env.MONGO_URI.replace('mongodb+srv://', 'mongodb://'));

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
