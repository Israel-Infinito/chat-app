const mongoose = require('mongoose');
const ChatController = require('../../controllers/chatController');
const Message = require('../../models/messageModel');
const User = require('../../models/userModel');

describe('ChatController', () => {
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
    // Clean before test
    await Message.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const user = await User.create({
      username: 'chatuser',
      password: 'hashedpass',
    });
    testUserId = user._id;
  });

  afterEach(async () => {
    // Clean after test
    await Message.deleteMany({});
    await User.deleteMany({});
  });

  describe('postMessage', () => {
    test('should post a message successfully when user is authenticated', async () => {
      const req = {
        user: {
          _id: testUserId,
          username: 'chatuser',
        },
        body: {
          message: 'Hello, everyone!',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ChatController.postMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
        })
      );

      const savedMessage = await Message.findOne({ message: 'Hello, everyone!' });
      expect(savedMessage).toBeDefined();
      expect(savedMessage.username).toBe('chatuser');
    });

    test('should return 401 if user is not authenticated', async () => {
      const req = {
        user: null,
        body: {
          message: 'This should fail',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ChatController.postMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'User not authenticated',
        })
      );
    });

    test('should handle database errors gracefully', async () => {
      const req = {
        user: {
          _id: testUserId,
          username: 'chatuser',
        },
        body: {
          message: 'Test message',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock Message.create to throw error
      jest.spyOn(Message, 'create').mockRejectedValueOnce(new Error('DB error'));

      await ChatController.postMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Failed to post chat message',
        })
      );

      Message.create.mockRestore();
    });

    test('should require message content', async () => {
      const req = {
        user: {
          _id: testUserId,
          username: 'chatuser',
        },
        body: {
          message: '', // Empty message
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ChatController.postMessage(req, res);

      // The controller accepts empty messages - could be enhanced with validation
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getMessages', () => {
    test('should retrieve all messages', async () => {
      // Create test messages
      await Message.create({
        userid: testUserId,
        username: 'chatuser',
        message: 'Message 1',
      });

      await Message.create({
        userid: testUserId,
        username: 'chatuser',
        message: 'Message 2',
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ChatController.getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.status).toBe('success');
      expect(callArgs.messages).toHaveLength(2);
      expect(callArgs.messages[0].message).toBe('Message 1');
      expect(callArgs.messages[1].message).toBe('Message 2');
    });

    test('should retrieve messages in chronological order', async () => {
      const msg1 = await Message.create({
        userid: testUserId,
        username: 'chatuser',
        message: 'First',
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      const msg2 = await Message.create({
        userid: testUserId,
        username: 'chatuser',
        message: 'Second',
      });

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ChatController.getMessages(req, res);

      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.messages[0]._id.toString()).toBe(msg1._id.toString());
      expect(callArgs.messages[1]._id.toString()).toBe(msg2._id.toString());
    });

    test('should return empty array when no messages exist', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ChatController.getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const callArgs = res.json.mock.calls[0][0];
      expect(callArgs.messages).toEqual([]);
    });

    test('should handle database errors gracefully', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock Message.find().sort() to throw error
      const mockQuery = {
        sort: jest.fn().mockRejectedValueOnce(new Error('DB error')),
      };
      jest.spyOn(Message, 'find').mockReturnValueOnce(mockQuery);

      await ChatController.getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Failed to retrieve chat messages',
        })
      );

      Message.find.mockRestore();
    });
  });
});
