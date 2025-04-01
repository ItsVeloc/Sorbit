require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbit',
  jwtSecret: process.env.JWT_SECRET || 'your_development_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  aiProvider: process.env.AI_PROVIDER || 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY
};