const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/users/create
router.post('/create', async (req, res) => {
    const { username, firstName, lastName, interests, auth0Id } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO users (username, first_name, last_name, interests, auth0_id) 
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (auth0_id) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                interests = EXCLUDED.interests
             RETURNING id, username, first_name, last_name`,
            [username, firstName, lastName, interests, auth0Id]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, username, created_at FROM users WHERE id = $1`,
            [req.params.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;