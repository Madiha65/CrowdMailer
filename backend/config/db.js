// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB Connected');
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// backend\config\db.js
const mongoose = require('mongoose');

const connectDB = async () => {
<<<<<<< HEAD
  // Avoid reconnecting on every serverless invocation.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // NOTE: process.exit(1) is removed on purpose. In a serverless
    // environment (Vercel), calling process.exit() kills the whole
    // function process instead of just failing this one request, which
    // can take down the API entirely. We throw instead so the request
    // fails gracefully and the next request can retry the connection.
    throw error;
=======
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // ⛔ STOP app if DB not connected
>>>>>>> f1980731a8528bb7132ddd14dd6056d6b284a58a
  }
};


module.exports = connectDB;