require('dotenv').config();
const db = require('./src/db');

async function test() {
    try {
        const res = await db.query('SELECT id, auth0_id FROM users');
        console.log('All users:');
        res.rows.forEach(u => console.log(`[${u.id}] => "${u.auth0_id}"`));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
test();
