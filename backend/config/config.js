require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/admission-predictor",
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  aiModelUrl: process.env.AI_MODEL_URL || "http://localhost:5001",
};

if (config.env === "production" && config.jwtSecret === "dev_secret_change_me") {
  console.warn("WARNING: using default JWT secret in production!");
}

module.exports = config;
