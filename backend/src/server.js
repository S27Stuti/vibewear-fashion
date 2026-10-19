const path = require('path');
const dotenv = require('dotenv');

// Load environment variables before importing app/db
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MySQL
    await connectDB();

    // Sync Sequelize models with MySQL tables
    await sequelize.sync({ alter: true });
    console.log('[Database] MySQL tables synchronized successfully.');

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 VibeWear MySQL Backend API Server is running`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Listening on: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error(`[Server Startup Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Uncaught Exception]: ${err.message}`);
});
