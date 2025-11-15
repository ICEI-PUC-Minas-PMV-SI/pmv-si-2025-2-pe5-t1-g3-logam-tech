const { Pool } = require("pg");
require("dotenv").config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "myapp",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  // SSL is only required for remote connections (e.g., RDS)
  // For local Docker connections, SSL should be disabled
  ssl:
    process.env.DB_SSL === "true"
      ? { require: true, rejectUnauthorized: false }
      : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully");
    client.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();

    // Create agents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        department VARCHAR(50) NOT NULL CHECK (department IN ('vendas', 'suporte', 'cobranca', 'orientacao')),
        location VARCHAR(50) NOT NULL CHECK (location IN ('RJ', 'Brasília', 'Curitiba', 'Salvador', 'Belém', 'Remoto')),
        status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        partner VARCHAR(100),
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(10) CHECK (category IN ('B2B', 'B2C', 'B2G')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database tables initialized successfully");
    client.release();
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log("✅ Database pool closed");
  } catch (error) {
    console.error("❌ Error closing database pool:", error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  closePool,
};
