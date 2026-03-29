const mongoose = require('mongoose');

// Use environment variable or fallback to local MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        console.log('Make sure MongoDB is running or update MONGODB_URI environment variable');
    }
}

module.exports = { connect };