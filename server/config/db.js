const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI in the environment variables.
 * We separate this into its own file so server.js stays clean
 * and so this function can be reused or mocked in tests.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);

    // In production, exit immediately — a broken DB means the app can't serve data.
    // In development, we warn and continue so you can still test non-DB routes
    // (like the health check) without a live Atlas URI.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('⚠️  Continuing without DB in development mode. Set a real MONGO_URI to enable database features.');
    }
  }
};

module.exports = connectDB;
