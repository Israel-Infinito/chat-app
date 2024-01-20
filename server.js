const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server);

// Listening for connection event on the socket io server
io.on('connection', (socket) => {
    // Getting username from the query parameters
    const username = socket.handshake.query.username;
    // Emit 'user joined' event to all clients
    io.emit('user joined', username + ' has joined the chat room');
    
    socket.on('disconnect', () => {
        // Emit 'user left' event to all clients
        io.emit('user left', username + ' has left the chat room');
    });

    // Listen for 'chat message' event
    socket.on('chat message', (message) => {
        // Broadcast 'chat message' event to all other clients
        io.emit('chat message', message);
    });
});

// Starting the server on the specified port defined
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('There was an unhandled rejection! Application will shut down');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('There was an uncaught exception! Application will shut down');
  console.log(err.name, err.message);
  process.exit(1);
});