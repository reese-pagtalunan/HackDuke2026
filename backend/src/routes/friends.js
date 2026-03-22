const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper — get numeric id from auth0_id
async function getNumericId(auth0Id) {
    const res = await db.query('SELECT id FROM users WHERE auth0_id = $1', [auth0Id]);
    if (res.rowCount === 0) return null;
    return res.rows[0].id;
}

// POST /api/friends/request
router.post('/request', async (req, res) => {
    const { requesterId, addresseeId } = req.body;
    try {
        const rId = await getNumericId(requesterId);
        const aId = await getNumericId(addresseeId);
        if (!rId || !aId) return res.status(404).json({ error: 'User not found' });

        const result = await db.query(`
            INSERT INTO friendships (requester_id, addressee_id, status)
            VALUES ($1, $2, 'pending')
            ON CONFLICT (requester_id, addressee_id)
            DO UPDATE SET status = 'pending'
            RETURNING *
        `, [rId, aId]);
        res.json({ success: true, friendship: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/friends/accept
router.post('/accept', async (req, res) => {
    const { requesterId, addresseeId } = req.body;
    try {
        const rId = await getNumericId(requesterId);
        const aId = await getNumericId(addresseeId);
        if (!rId || !aId) return res.status(404).json({ error: 'User not found' });

        const result = await db.query(`
            UPDATE friendships 
            SET status = 'accepted'
            WHERE requester_id = $1 AND addressee_id = $2
            RETURNING *
        `, [rId, aId]);
        res.json({ success: true, friendship: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/friends/:userId/list
router.get('/:userId/list', async (req, res) => {
    const { userId } = req.params;
    try {
        const numericId = await getNumericId(userId);
        if (!numericId) return res.status(404).json({ error: 'User not found' });

        // Accepted friends
        const friendQuery = `
            SELECT u.id, u.auth0_id, u.first_name, u.last_name
            FROM friendships f
            JOIN users u ON (f.requester_id = u.id OR f.addressee_id = u.id)
            WHERE (f.requester_id = $1 OR f.addressee_id = $1)
              AND u.id != $1
              AND f.status = 'accepted'
        `;
        const friendsRes = await db.query(friendQuery, [numericId]);

        // Suggestions — exclude anyone we already have a relationship with
        const encountersQuery = `
            SELECT u.id, u.auth0_id, u.first_name, u.last_name, 5 as encounter_count
            FROM users u
            WHERE u.id != $1
              AND u.id NOT IN (
                  SELECT requester_id FROM friendships WHERE addressee_id = $1
                  UNION
                  SELECT addressee_id FROM friendships WHERE requester_id = $1
              )
            LIMIT 50
        `;
        const encountersRes = await db.query(encountersQuery, [numericId]);

        // Incoming requests
        const requestsQuery = `
            SELECT u.id, u.auth0_id, u.first_name, u.last_name, f.created_at
            FROM friendships f
            JOIN users u ON f.requester_id = u.id
            WHERE f.addressee_id = $1 AND f.status = 'pending'
        `;
        const requestsRes = await db.query(requestsQuery, [numericId]);

        res.json({
            friends: friendsRes.rows,
            suggestions: encountersRes.rows,
            requests: requestsRes.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST /api/friends/decline
router.post('/decline', async (req, res) => {
    const { requesterId, addresseeId } = req.body;
    try {
        const rId = await getNumericId(requesterId);
        const aId = await getNumericId(addresseeId);
        if (!rId || !aId) return res.status(404).json({ error: 'User not found' });

        await db.query(`
            DELETE FROM friendships 
            WHERE requester_id = $1 AND addressee_id = $2 AND status = 'pending'
        `, [rId, aId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;