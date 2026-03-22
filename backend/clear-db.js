require('dotenv').config();
const db = require('./src/db');

async function clearDb() {
    try {
        console.log('Sweeping database tables...');
        // Cascading TRUNCATE ensures friendships and messages connected to users are also wiped
        await db.query('TRUNCATE TABLE users, friendships, messages RESTART IDENTITY CASCADE;');
        console.log('✅ Success! All databases have been completely cleared. Accounts reset from scratch.');
    } catch (err) {
        console.error('❌ Error clearing databases:', err.message);
    } finally {
        process.exit(0);
    }
}

clearDb();
