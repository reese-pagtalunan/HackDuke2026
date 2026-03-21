require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const socketHandler = require('./sockets');
const locationRoutes = require('./routes/location');
const friendsRoutes = require('./routes/friends');

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Attach Socket.io for Real-Time Chat
socketHandler(server);

// Routes
app.use('/api/location', locationRoutes);
app.use('/api/friends', friendsRoutes);

// Health check specifically for DigitalOcean App Platform setup
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
