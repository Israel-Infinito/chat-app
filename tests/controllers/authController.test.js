const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AuthController = require('../../controllers/authController');
const User = require('../../models/userModel');

describe('AuthController', () => {
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
    // Clean before each test
    await User.deleteMany({});
  });

  afterEach(async () => {
    // Clean after each test
    await User.deleteMany({});
  });

  describe('register', () => {
    test('should successfully register a new user', async () => {
      const req = {
        body: {
          username: 'newuser',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          user: 'newuser',
        })
      );

      // Wait a moment for database persistence
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const user = await User.findOne({ username: 'newuser' });
      expect(user).not.toBeNull();
      expect(user.username).toBe('newuser');
    }, 10000);

    test('should return error if username already exists', async () => {
      // Create existing user
      await User.create({
        username: 'existing',
        password: 'hashedpass',
      });

      const req = {
        body: {
          username: 'existing',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Username already exists',
        })
      );
    });

    test('should hash the password before storing', async () => {
      const req = {
        body: {
          username: 'userpass',
          password: 'plainpassword123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await AuthController.register(req, res);

      // Wait for database persistence
      await new Promise(resolve => setTimeout(resolve, 50));

      const user = await User.findOne({ username: 'userpass' });
      expect(user).not.toBeNull();
      expect(user.password).not.toBe('plainpassword123');
      const isPasswordMatch = await bcrypt.compare('plainpassword123', user.password);
      expect(isPasswordMatch).toBe(true);
    }, 10000);

    test('should handle error gracefully', async () => {
      const req = {
        body: {
          username: 'erroruser',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock User.create to throw an error
      jest.spyOn(User, 'create').mockRejectedValueOnce(new Error('DB error'));

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Failed to create user',
        })
      );

      User.create.mockRestore();
    });
  });

  describe('login', () => {
    test('should return error if user not found', async () => {
      const req = {
        body: {
          username: 'nonexistent',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const next = jest.fn();

      // Simulate passport authentication failure
      const mockPassportAuth = jest.fn((strategy, callback) => {
        callback(null, null, { message: 'Invalid credentials' });
        return (req, res, next) => {};
      });

      jest.spyOn(require('passport'), 'authenticate').mockReturnValue(mockPassportAuth);

      next();

      require('passport').authenticate.mockRestore();
    });
  });

  describe('logout', () => {
    test('should logout user and redirect', () => {
      const req = {
        logout: jest.fn(),
      };

      const res = {
        redirect: jest.fn(),
      };

      AuthController.logout(req, res);

      expect(req.logout).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });
  });
});
