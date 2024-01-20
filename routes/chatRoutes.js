const express = require('express');
const path = require('path');
const chatController = require('../controllers/chatController');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// route to get chat page
router.get('/chat', ensureAuthenticated, function(req, res) { 
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// route to post message
router.post('/messages', chatController.postMessage);

// route to get messages
router.get('/messages', chatController.getMessages);
module.exports = router;