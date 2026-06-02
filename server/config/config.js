require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'service-sphere-local-secret';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is not defined. Using a local fallback secret. Do not use this in production.');
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/service-sphere'
};
