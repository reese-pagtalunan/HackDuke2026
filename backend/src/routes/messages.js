const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/messages/:userA/:userB — load chat history
router.get('/:userA/:userB', async (req, res) => {
    const { userA, userB } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND recipient_id = $2)
               OR (sender_id = $2 AND recipient_id = $1)
            ORDER BY created_at ASC
        `, [userA, userB]);
        res.json({ messages: result.rows });
    } catch (err) {
        console.error('Messages fetch error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/messages — save a message
router.post('/', async (req, res) => {
    const { sender_id, recipient_id, content } = req.body;
    try {
        const result = await db.query(`
            INSERT INTO messages (sender_id, recipient_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [sender_id, recipient_id, content]);
        res.json({ message: result.rows[0] });
    } catch (err) {
        console.error('Message save error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;