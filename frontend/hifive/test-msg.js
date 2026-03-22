import { io } from 'socket.io-client';

const socket = io('https://hifiveapp-7y7nb.ondigitalocean.app', { transports: ['websocket'] });

socket.on('connect', () => {
    console.log('Connected! Socket ID:', socket.id);
    socket.emit('identify', 'google-oauth2|109391622616301293249');

    socket.emit('send_message', {
        senderId: 'google-oauth2|109391622616301293249',
        recipientId: 'google-oauth2|107002704740889517563',
        content: 'ping ping'
    });
});

socket.on('message_sent', (msg) => {
    console.log('SUCCESS: message_sent received:', msg);
    process.exit(0);
});

socket.on('message_error', (err) => {
    console.error('ERROR: message_error received:', err);
    process.exit(1);
});

setTimeout(() => {
    console.log('Timeout waiting for response');
    process.exit(1);
}, 5000);
