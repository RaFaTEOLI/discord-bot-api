import 'dotenv/config';

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://root:1234@localhost:27017/',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '82r628f72998k',
  commandPrefix: '!',
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  apiQueueUsername: process.env.API_QUEUE_USERNAME || 'discord-bot-api-queue',
  apiQueuePassword: process.env.API_QUEUE_PASSWORD || 'password',
  apiQueuePort: process.env.API_QUEUE_PORT || 5672,
  apiQueueAdress: process.env.API_QUEUE_ADRESS || 'localhost',
  useApiQueue: process.env.USE_API_QUEUE || false,
  nodeEnv: process.env.NODE_ENV || 'development'
};
