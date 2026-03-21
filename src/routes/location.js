const express = require('express');
const router = express.Router();
const db = require('../db');

// /api/location/ping
// Example Input: { userId: 1, lat: 37.7749, lng: -122.4194 }
router.post('/ping', async (req, res) => {
    const { userId, lat, lng } = req.body;

    if (!userId || !lat || !lng) {
        return res.status(400).json({ error: 'Missing userId, lat, or lng' });
    }

    try {
        // 1. Update user location using PostGIS
        // Note: PostGIS uses (Longitude, Latitude) order for ST_MakePoint
        const updateQuery = `
            UPDATE users 
            SET geom = ST_SetSRID(ST_MakePoint($1, $2), 4326),
                last_ping_time = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id;
        `;
        const userRes = await db.query(updateQuery, [lng, lat, userId]);

        if (userRes.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Find nearby users (within 50 meters) who recently pinged
        const nearbyQuery = `
            SELECT id, username 
            FROM users 
            WHERE id != $1 
              AND ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 50)
              AND last_ping_time > CURRENT_TIMESTAMP - INTERVAL '5 minutes';
        `;
        const nearbyUsers = await db.query(nearbyQuery, [userId, lng, lat]);

        // 3. Log an encounter for everyone we just passed by
        const updates = [];
        for (const nearbyUser of nearbyUsers.rows) {
            // Sort IDs to ensure (A, B) and (B, A) are treated as the same unique constraint in the DB
            const userA = Math.min(userId, nearbyUser.id);
            const userB = Math.max(userId, nearbyUser.id);

            const encounterQuery = `
                INSERT INTO encounters (user_a_id, user_b_id, encounter_count, last_seen_date)
                VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
                ON CONFLICT (user_a_id, user_b_id) 
                DO UPDATE SET 
                    encounter_count = encounters.encounter_count + 1,
                    last_seen_date = CURRENT_TIMESTAMP
                RETURNING encounter_count;
            `;
            updates.push(db.query(encounterQuery, [userA, userB]));
        }

        await Promise.all(updates);

        res.json({
            success: true,
            passedBy: nearbyUsers.rows
        });

    } catch (err) {
        console.error('Location ping error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;
