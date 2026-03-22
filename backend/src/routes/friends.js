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

        // Suggestions — encountered 3+ times
        const encountersQuery = `
            SELECT u.id, u.auth0_id, u.first_name, u.last_name, e.encounter_count
            FROM encounters e
            JOIN users u ON (e.user_a_id = u.id OR e.user_b_id = u.id)
            WHERE (e.user_a_id = $1 OR e.user_b_id = $1)
              AND u.id != $1
              AND e.encounter_count >= 3
              AND e.last_seen_date > CURRENT_TIMESTAMP - INTERVAL '7 days'
        `;
        const encountersRes = await db.query(encountersQuery, [numericId]);

        res.json({
            friends: friendsRes.rows,
            suggestions: encountersRes.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;