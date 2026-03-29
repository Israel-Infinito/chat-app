const mongoose = require('mongoose');
const Message = require('../../models/messageModel');
const User = require('../../models/userModel');

describe('Message Model', () => {
  let testUserId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/chat-app-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  }, 15000);

  beforeEach(async () => {
    // Clean up before creating test user
    await Message.deleteMany({});
    await User.deleteMany({});
    
    // Create a test user
    const user = await User.create({
      username: 'testuser',
      password: 'hashedpass123',
    });
    testUserId = user._id;
  });

  afterEach(async () => {
    // Clean up messages and users
    await Message.deleteMany({});
    await User.deleteMany({});
  });

  test('should create a message with userid, username, and content', async () => {
    const message = await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'Hello, World!',
    });

    expect(message).toBeDefined();
    expect(message.userid).toEqual(testUserId);
    expect(message.username).toBe('testuser');
    expect(message.message).toBe('Hello, World!');
    expect(message.timestamp).toBeDefined();
  });

  test('should create a message with default timestamp', async () => {
    const beforeTime = new Date();
    const message = await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'Test message',
    });
    const afterTime = new Date();

    expect(message.timestamp).toBeDefined();
    expect(message.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(message.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });

  test('should find messages by userid', async () => {
    await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'Message 1',
    });

    await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'Message 2',
    });

    const messages = await Message.find({ userid: testUserId });
    expect(messages.length).toBe(2);
  });

  test('should retrieve all messages sorted by timestamp', async () => {
    const msg1 = await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'First',
    });

    // Add a small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const msg2 = await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'Second',
    });

    const allMessages = await Message.find().sort({ timestamp: 1 });
    expect(allMessages.length).toBe(2);
    expect(allMessages[0]._id).toEqual(msg1._id);
    expect(allMessages[1]._id).toEqual(msg2._id);
  });

  test('should delete a message', async () => {
    const message = await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'Delete me',
    });

    await Message.deleteOne({ _id: message._id });
    const foundMessage = await Message.findOne({ _id: message._id });

    expect(foundMessage).toBeNull();
  });

  test('should update a message', async () => {
    const createdMessage = await Message.create({
      userid: testUserId,
      username: 'testuser',
      message: 'Original message',
    });

    // Fetch fresh from DB and update
    const message = await Message.findOne({ _id: createdMessage._id });
    expect(message).not.toBeNull();
    
    message.message = 'Updated message';
    const updatedMessage = await message.save();

    expect(updatedMessage.message).toBe('Updated message');
    
    // Verify update persisted
    const verifyMessage = await Message.findOne({ _id: createdMessage._id });
    expect(verifyMessage.message).toBe('Updated message');
  });
});
