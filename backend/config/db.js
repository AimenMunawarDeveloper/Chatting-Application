const mongoose = require("mongoose");
const colors = require("colors");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected:${conn.connection.host}`.blue.underline);
  } catch (error) {
    console.log(`Error:${error.message}`.red.bold);
    process.exit();
  }
};
module.exports = connectDB;
