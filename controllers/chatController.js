const User = require('../models/userModel');
const Message = require('../models/messageModel');

class ChatController {
  // Handling the POST request to /chat endpoint
  async postMessage(req, res) {
    try {
      const { message } = req.body;
      
      // Use authenticated user from Passport session
      if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' });
      }

      const messageObj = { 
        userid: req.user._id, 
        username: req.user.username, 
        message 
      };
      const savedMessage = await Message.create(messageObj);
      res.status(201).json({savedMessage, status: 'success'});
    } catch (error) {
      console.error('Error posting chat message:', error);
      res.status(500).json({ status: 'error', message: 'Failed to post chat message' });
    }
  }

  // Handling the GET request to /chat endpoint
  async getMessages(req, res) {
    try {
      const chatMessages = await Message.find().sort({ timestamp: 1 });
      res.status(200).json({ status: 'success', messages: chatMessages });
    } catch (error) {
      console.error('Error retrieving chat messages:', error);
      res.status(500).json({ status: 'error', message: 'Failed to retrieve chat messages' });
    }
  }
}

module.exports = new ChatController();
