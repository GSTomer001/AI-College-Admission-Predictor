const mongoose = require("mongoose");
const config = require("./config");

let memoryServer = null;

async function tryConnect(uri, timeoutMs = 3000) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: timeoutMs });
  return uri;
}

/**
 * Connect to MongoDB.
 * 1) Tries the configured MONGO_URI (from .env) first.
 * 2) If unreachable and not in production, automatically starts an
 *    in-memory MongoDB via mongodb-memory-server (dev convenience —
 *    no MongoDB installation required; data resets on restart).
 */
async function connectDB() {
  try {
    await tryConnect(config.mongoUri, 3000);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (err) {
    console.warn(`Could not connect to MONGO_URI (${config.mongoUri}): ${err.message}`);
  }

  if (config.env !== "production") {
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      console.log("Starting in-memory MongoDB (first run downloads a binary, please wait)...");
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri("admission-predictor");
      await tryConnect(uri, 10000);
      console.log("In-memory MongoDB started (data resets on restart).");
      return mongoose.connection;
    } catch (err) {
      console.error(`In-memory MongoDB failed: ${err.message}`);
    }
  }

  console.error(
    "No MongoDB available. Install/start MongoDB or fix MONGO_URI in backend/.env"
  );
  process.exit(1);
}

module.exports = connectDB;

