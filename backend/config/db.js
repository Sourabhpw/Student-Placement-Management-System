const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_portal';

    // Attempt connecting to configured MongoDB (e.g., local mongod or Atlas)
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2500, // Timeout quickly if local mongod is not running
      });
      console.log(`[MongoDB] Connected successfully to: ${mongoUri}`);
      return;
    } catch (connectionErr) {
      console.warn(`[MongoDB] Direct connection to ${mongoUri} failed (${connectionErr.message}).`);
      console.log('[MongoDB] Initializing in-memory MongoDB fallback for instant full-stack functionality...');
      
      mongoMemoryServer = await MongoMemoryServer.create();
      const fallbackUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(fallbackUri);
      console.log(`[MongoDB] Connected to MongoDB Memory Server at: ${fallbackUri}`);
    }
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
