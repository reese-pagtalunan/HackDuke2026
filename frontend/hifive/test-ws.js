import { io } from 'socket.io-client';
const socket = io('https://hifiveapp-7y7nb.ondigitalocean.app', { transports: ['websocket'] });
socket.on('connect', () => {
    console.log('Connected directly via WebSocket!', socket.id);
    socket.disconnect();
});
socket.on('connect_error', (err) => {
    console.error('Connection failed:', err.message);
});
