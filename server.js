const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = require('path');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const { User, Message } = require('./user.js');
const bcrypt = require('bcrypt');


const uri = 'mongodb+srv://ioa:rnlEXOGK91WwZGkQ@clusterusers.6ypib1g.mongodb.net/test?retryWrites=true&w=majority';	

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}

connect();
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// const users = [
//     { username: 'user1', password: 'password1' },
//     { username: 'user2', password: 'password2' },
// ];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// User registration route
app.post('/register', async (req, res) => {
    console.log('Registering user:', req.body);
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ username: req.body.username, password: hashedPassword });
        res.status(201).json({ status: 'success' , user: user.username});
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', message: 'Failed to create user' });
    }
});

// User login route
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
        return res.status(400).json({ status: 'error', message: 'Incorrect username or password' });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).json({ status: 'success', user: user.username });
        } else {
            res.status(401).json({ status: 'error', message: 'Incorrect username or password' });
        }
    } catch {
       res.status(500).json({ status: 'error', message: 'Failed to login' });
    }
});

// Post message 
app.post('/messages', async (req, res) => {
     const username = req.body.username;
     const message = req.body.message;
    // Fetch user from database
    const user = await User.findOne({ username: username });

    // Create message object
    const messageObj = { userid: user._id, username: username, message: message };

    // Save message to database
    const savedMessage = await Message.create(messageObj);

    // Send message object back to client
    res.status(201).json(savedMessage);
});

// Retrieve all messages
app.get('/messages', async (req, res) => {
    try {
        // Retrieve all chat messages from the database
        const chatMessages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json({ status: 'success', messages: chatMessages });
    } catch (error) {
        console.error('Error retrieving chat messages:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve chat messages' });
    }
});




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
    console.log(`Server listening at port ${port}`);
});