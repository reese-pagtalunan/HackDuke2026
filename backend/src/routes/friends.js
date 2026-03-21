const express = require('express');
const router = express.Router();
const db = require('../db');

// Request a friend
router.post('/request', async (req, res) => {
    const { requesterId, addresseeId } = req.body;

    if (!requesterId || !addresseeId) {
        return res.status(400).json({ error: 'Missing requesterId or addresseeId' });
    }

    try {
        const query = `
            INSERT INTO friendships (requester_id, addressee_id, status)
            VALUES ($1, $2, 'pending')
            ON CONFLICT (requester_id, addressee_id) 
            DO UPDATE SET status = 'pending'
            RETURNING *;
        `;
        const result = await db.query(query, [requesterId, addresseeId]);
        res.json({ success: true, friendship: result.rows[0] });
    } catch (err) {
        console.error('Friend request error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Accept a friend request
router.post('/accept', async (req, res) => {
    const { requesterId, addresseeId } = req.body;

    try {
        const query = `
            UPDATE friendships 
            SET status = 'accepted'
            WHERE requester_id = $1 AND addressee_id = $2
            RETURNING *;
        `;
        const result = await db.query(query, [requesterId, addresseeId]);
        res.json({ success: true, friendship: result.rows[0] });
    } catch (err) {
        console.error('Accept request error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// List friends/encounters for a user
router.get('/:userId/list', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find accepted friends
        const friendQuery = `
            SELECT u.id, u.username 
            FROM friendships f
            JOIN users u ON (f.requester_id = u.id OR f.addressee_id = u.id)
            WHERE (f.requester_id = $1 OR f.addressee_id = $1)
              AND u.id != $1
              AND f.status = 'accepted';
        `;
        const friendsRes = await db.query(friendQuery, [userId]);

        // Find people encountered more than 2 times (suggestions)
        const encountersQuery = `
            SELECT u.id, u.username, e.encounter_count 
            FROM encounters e
            JOIN users u ON (e.user_a_id = u.id OR e.user_b_id = u.id)
            WHERE (e.user_a_id = $1 OR e.user_b_id = $1)
              AND u.id != $1
              AND e.encounter_count >= 3
              AND e.last_seen_date > CURRENT_TIMESTAMP - INTERVAL '7 days';
        `;
        const encountersRes = await db.query(encountersQuery, [userId]);

        res.json({
            friends: friendsRes.rows,
            suggestions: encountersRes.rows
        });
    } catch (err) {
        console.error('List friends error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;
