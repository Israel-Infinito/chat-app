const express = require('express');
const path = require('path');
const chatController = require('../controllers/chatController');
const { ensureAuthenticated } = require('../middleware/auth');

class ChatRoutes {
    constructor() {
        this.router = express.Router();
        this.configureRoutes();
    }

    // Routes for the chat page
    configureRoutes() {
        this.router.get('/chat', ensureAuthenticated, this.getChatPage);
        this.router.post('/messages', chatController.postMessage);
        this.router.get('/messages', chatController.getMessages);
    }

    getChatPage(req, res) {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
}

module.exports = new ChatRoutes().router;