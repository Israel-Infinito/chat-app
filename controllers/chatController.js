const User = require('../models/userModel');
const Message = require('../models/messageModel');

exports.postMessage = async (req, res) => {
  const username = req.body.username;
  const message = req.body.message;
  const user = await User.findOne({ username: username });
  const messageObj = { userid: user._id, username: username, message: message };
  const savedMessage = await Message.create(messageObj);
  res.status(201).json(savedMessage);
};

exports.getMessages = async (req, res) => {
  try {
    const chatMessages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json({ status: 'success', messages: chatMessages });
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve chat messages' });
  }
};