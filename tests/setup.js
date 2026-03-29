// Jest setup file
const mongoose = require('mongoose');

// Suppress MongoDB driver warnings
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning') || args[0].includes('Deprecation') || args[0].includes('MONGODB'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
});

// Ensure all mongoose connections are closed after all tests
afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}, 30000);
