const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB at ${process.env.MONGO_URI}`);
    console.error(error.message);

    // In development, try a local MongoDB fallback to make it easier to run locally
    if (process.env.NODE_ENV !== 'production') {
      const local = 'mongodb://127.0.0.1:27017/ecommerce'
      console.log(`🔁 Attempting local fallback: ${local}`)
      try {
        const conn = await mongoose.connect(local)
        console.log(`✅ MongoDB Connected (local): ${conn.connection.host}`)
        return
      } catch (err) {
        console.error('❌ Local fallback failed:', err.message)
      }
    }

    // If we reach here, nothing worked — exit with helpful message
    console.error('Please ensure your MONGO_URI is correct, DNS is available, or run a local MongoDB instance.')
    process.exit(1);
  }
};

module.exports = connectDB;