const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    console.log('User connected:', username);
    
    io.emit('user joined', username + ' has joined the conversation');
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', username);
        // Emit 'user left' event to all clients
        io.emit('user left', username + ' has left the conversation');
    });

    // Listen for 'chat message' event
    socket.on('chat message', (message) => {
        // Broadcast 'chat message' event to all other clients
        console.log('Message:', message);
        io.emit('chat message', message);
    });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});