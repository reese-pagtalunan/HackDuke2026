require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { auth } = require('express-oauth2-jwt-bearer');

const socketHandler = require('./sockets');
const locationRoutes = require('./routes/location');
const friendsRoutes = require('./routes/friends');
const usersRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);

// Middlewares first
app.use(cors());
app.use(express.json());

// Auth0 JWT checker
const checkJwt = auth({
    audience: 'https://dev-gnf25xr2lt37ohtu.us.auth0.com/api/v2/',
    issuerBaseURL: 'https://dev-gnf25xr2lt37ohtu.us.auth0.com',
});

// Socket.io
socketHandler(server);

// Health check (no auth needed)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Protected routes
app.use('/api/location', locationRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/user', usersRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});