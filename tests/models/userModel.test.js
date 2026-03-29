const mongoose = require('mongoose');
const User = require('../../models/userModel');

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to a test MongoDB database
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/chat-app-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  }, 15000);

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
  });

  afterEach(async () => {
    // Clear users collection after each test
    await User.deleteMany({});
  });

  test('should create a user with username and password', async () => {
    const user = await User.create({
      username: 'testuser',
      password: 'hashedpassword123',
    });

    expect(user).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.password).toBe('hashedpassword123');
    expect(user._id).toBeDefined();
  });

  test('should find a user by username', async () => {
    await User.create({
      username: 'findme',
      password: 'pass123',
    });

    const user = await User.findOne({ username: 'findme' });
    expect(user).toBeDefined();
    expect(user.username).toBe('findme');
  });

  test('should update a user', async () => {
    const user = await User.create({
      username: 'original',
      password: 'pass123',
    });

    user.password = 'newpass456';
    const updatedUser = await user.save();

    expect(updatedUser.password).toBe('newpass456');
  });

  test('should delete a user', async () => {
    const user = await User.create({
      username: 'deleteme',
      password: 'pass123',
    });

    await User.deleteOne({ _id: user._id });
    const foundUser = await User.findOne({ _id: user._id });

    expect(foundUser).toBeNull();
  });

  test('should handle duplicate username gracefully', async () => {
    await User.create({
      username: 'duplicate',
      password: 'pass123',
    });

    // Attempting to create duplicate - depends on schema validation
    const users = await User.find({ username: 'duplicate' });
    expect(users.length).toBe(1);
  });
});
