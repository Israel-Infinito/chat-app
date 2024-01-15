const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// Create model class for 
const messageSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Message };