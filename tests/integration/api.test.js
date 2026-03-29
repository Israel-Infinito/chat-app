const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../../models/userModel');
const Message = require('../../models/messageModel');
const AuthController = require('../../controllers/authController');
const ChatController = require('../../controllers/chatController');
const { ensureAuthenticated } = require('../../middleware/auth');

// Create a test Express app
function createTestApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(
    session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Routes
  app.post('/api/auth/register', AuthController.register);
  app.post('/api/auth/login', AuthController.login);
  app.post('/api/auth/logout', AuthController.logout);

  app.get('/api/chat/messages', ChatController.getMessages);
  app.post('/api/chat/messages', ChatController.postMessage);

  app.get('/protected', ensureAuthenticated, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
  });

  return app;
}

describe('Integration Tests', () => {
  let app;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/chat-app-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    app = createTestApp();
  }, 15000);

  beforeEach(async () => {
    // Clean before each test
    await User.deleteMany({});
    await Message.deleteMany({});
  });

  afterEach(async () => {
    // Clean after each test
    await User.deleteMany({});
    await Message.deleteMany({});
  });

  describe('Authentication Flow', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.user).toBe('newuser');

      const user = await User.findOne({ username: 'newuser' });
      expect(user).toBeDefined();
    });

    test('should not allow duplicate user registration', async () => {
      // Register first user
      await request(app).post('/api/auth/register').send({
        username: 'duplicate',
        password: 'password123',
      });

      // Try to register with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          password: 'password456',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Username already exists');
    });
  });

  describe('Chat Messages', () => {
    test('should retrieve all messages', async () => {
      const user = await User.create({
        username: 'testuser',
        password: 'hashedpass',
      });

      await Message.create({
        userid: user._id,
        username: 'testuser',
        message: 'Test message 1',
      });

      await Message.create({
        userid: user._id,
        username: 'testuser',
        message: 'Test message 2',
      });

      const response = await request(app).get('/api/chat/messages');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.messages).toHaveLength(2);
      expect(response.body.messages[0].message).toBe('Test message 1');
      expect(response.body.messages[1].message).toBe('Test message 2');
    });

    test('should return empty messages array initially', async () => {
      const response = await request(app).get('/api/chat/messages');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.messages).toEqual([]);
    });
  });

  describe('Protected Routes', () => {
    test('should allow authenticated users to access protected routes', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        username: 'authuser',
        password: hashedPassword,
      });

      const agent = request.agent(app);

      // Login
      const loginResponse = await agent
        .post('/api/auth/login')
        .send({
          username: 'authuser',
          password: 'password123',
        });

      expect(loginResponse.status).toBe(200);

      // Access protected route
      const protectedResponse = await agent.get('/protected');
      expect(protectedResponse.status).toBe(200);
      expect(protectedResponse.body.message).toBe('Protected route');
    });

    test('should redirect unauthenticated users from protected routes', async () => {
      const response = await request(app).get('/protected');

      expect(response.status).toBe(302); // Redirect status
      expect(response.headers.location).toContain('/login');
    });
  });

  describe('Message Posting', () => {
    test('should post a message when authenticated', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        username: 'msguser',
        password: hashedPassword,
      });

      const agent = request.agent(app);

      // Login
      await agent
        .post('/api/auth/login')
        .send({
          username: 'msguser',
          password: 'password123',
        });

      // Post message
      const messageResponse = await agent
        .post('/api/chat/messages')
        .send({
          message: 'My first message',
        });

      expect(messageResponse.status).toBe(201);
      expect(messageResponse.body.status).toBe('success');

      const savedMessage = await Message.findOne({ message: 'My first message' });
      expect(savedMessage).toBeDefined();
      expect(savedMessage.username).toBe('msguser');
    });

    test('should not post message without authentication', async () => {
      const response = await request(app)
        .post('/api/chat/messages')
        .send({
          message: 'Unauthorized message',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User not authenticated');
    });
  });
});
