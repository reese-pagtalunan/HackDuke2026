const express = require('express');
const router = express.Router();
const db = require('../db');

// Haversine formula — returns distance between two GPS points in meters
function getDistanceMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// POST /api/location/ping
// Input: { auth0Id, lat, lng }
router.post('/ping', async (req, res) => {
    const { auth0Id, lat, lng } = req.body;

    if (!auth0Id || lat == null || lng == null) {
        return res.status(400).json({ error: 'Missing auth0Id, lat, or lng' });
    }

    try {
        // 1. Update this user's location using auth0_id
        const updateQuery = `
            UPDATE users 
            SET lat = $1, lng = $2, last_ping_time = CURRENT_TIMESTAMP
            WHERE auth0_id = $3
            RETURNING id, first_name, last_name;
        `;
        const userRes = await db.query(updateQuery, [lat, lng, auth0Id]);

        if (userRes.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRes.rows[0].id;

        // 2. Get all recently active users (pinged in the last 5 minutes)
        const nearbyQuery = `
            SELECT id, first_name, last_name, lat, lng 
            FROM users 
            WHERE id != $1 
            AND last_ping_time > CURRENT_TIMESTAMP - INTERVAL '5 minutes'
            AND lat IS NOT NULL
            AND lng IS NOT NULL;
        `;
        const allUsers = await db.query(nearbyQuery, [userId]);

        // 3. Filter to users within 50 meters using Haversine
        const nearbyUsers = allUsers.rows.filter(u =>
            getDistanceMeters(lat, lng, u.lat, u.lng) <= 50
        );

        // 4. Record encounters for nearby users
        const updates = nearbyUsers.map(nearbyUser => {
            const userA = Math.min(userId, nearbyUser.id);
            const userB = Math.max(userId, nearbyUser.id);

            return db.query(`
                INSERT INTO encounters (user_a_id, user_b_id, encounter_count, last_seen_date)
                VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
                ON CONFLICT (user_a_id, user_b_id) 
                DO UPDATE SET 
                    encounter_count = encounters.encounter_count + 1,
                    last_seen_date = CURRENT_TIMESTAMP
                RETURNING encounter_count;
            `, [userA, userB]);
        });

        await Promise.all(updates);

        res.json({
            success: true,
            nearbyCount: nearbyUsers.length,
            passedBy: nearbyUsers.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}` })),
        });

    } catch (err) {
        console.error('Location ping error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;