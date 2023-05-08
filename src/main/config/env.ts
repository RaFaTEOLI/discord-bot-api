export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://root:1234@localhost:27017/',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || '82r628f72998k',
  commandPrefix: '!',
  appUrl: 'http://localhost:5173'
};
