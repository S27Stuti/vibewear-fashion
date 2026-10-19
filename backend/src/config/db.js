const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'vibewear';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '1234';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

// Helper to ensure database exists before Sequelize connects (local dev pre-flight)
const ensureDatabaseExists = async () => {
  if (process.env.DATABASE_URL) return; // Skip if using cloud connection string
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
  } catch (err) {
    console.warn(`[MySQL Notice]: Could not run CREATE DATABASE pre-flight check: ${err.message}`);
  }
};

const dialectOptions = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' && process.env.DATABASE_URL
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : {};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      dialectOptions,
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: false
      }
    })
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mysql',
      dialectOptions,
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: false
      }
    });

const connectDB = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log(`[Database] MySQL Connected via Sequelize to host: ${DB_HOST}:${DB_PORT}, database: ${DB_NAME}`);
  } catch (error) {
    console.error(`[Database Error] MySQL Connection Failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = {
  sequelize,
  connectDB
};
