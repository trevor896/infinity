const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/portfolio',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.warn('PostgreSQL pool warning:', err.message || err);
});

module.exports = {
  query: async (text, params) => pool.query(text, params),
  pool,
};
