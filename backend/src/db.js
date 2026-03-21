const { Pool } = require('pg');
require('dotenv').config();

// Connect to DigitalOcean PostgreSQL or local DB
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/proximitydb',
    // SSL is usually required by DigitalOcean managed databases
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
