import { io } from 'socket.io-client';

const socket = io('https://hifiveapp-7y7nb.ondigitalocean.app', { transports: ['websocket'] });

const RECIPIENT_ID = 'google-oauth2|107002704740889517563';

socket.on('connect', () => {
    console.log('Recipient connected! Socket ID:', socket.id);
    socket.emit('identify', RECIPIENT_ID);
    console.log('Identified as', RECIPIENT_ID);
});

socket.on('receive_message', (msg) => {
    console.log('SUCCESS: receive_message event triggered!', msg);
    process.exit(0);
});

socket.on('connect_error', (err) => {
    console.error('Connection failed:', err.message);
});

// Run for 15 seconds
setTimeout(() => {
    console.log('Timeout waiting for message');
    process.exit(1);
}, 15000);
