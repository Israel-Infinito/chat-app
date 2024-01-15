const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const server = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/chat-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});