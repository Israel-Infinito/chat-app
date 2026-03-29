# Testing Documentation

## Overview
Comprehensive test suite for the Nexus Chat application with Jest testing framework.

## Test Structure

### Test Files Created

1. **tests/models/userModel.test.js**
   - Tests for User model CRUD operations
   - Validates user creation, retrieval, update, and deletion
   - Tests duplicate username handling

2. **tests/models/messageModel.test.js**
   - Tests for Message model functionality
   - Validates message creation with timestamps
   - Tests message retrieval and sorting
   - Validates userid relationships

3. **tests/controllers/authController.test.js**
   - User registration tests
   - Login/logout functionality tests
   - Password hashing validation
   - Error handling for duplicate usernames

4. **tests/controllers/chatController.test.js**
   - Message posting tests
   - Message retrieval tests
   - Authentication requirement validation
   - Error handling tests

5. **tests/middleware/auth.test.js**
   - Authentication middleware tests
   - Protected route access validation
   - Redirect functionality tests

6. **tests/integration/api.test.js**
   - End-to-end API integration tests
   - Authentication flow validation
   - Protected route integration tests
   - Message posting and retrieval flows

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

## Configuration Files

- **jest.config.js** - Jest configuration with test environment and coverage settings
- **tests/setup.js** - Jest setup file for suppressing deprecation warnings

## Test Statistics

- **Total Test Files:** 6
- **Total Tests:** 37+
- **Passing Tests:** 32+
- **Coverage Areas:**
  - Unit Tests: Models, Controllers, Middleware
  - Integration Tests: API endpoints, Authentication flows
  - Error Handling: Database errors, validation errors, unauthorized access

## Test Coverage

The test suite covers:

### Authentication
- User registration with password hashing
- User login/logout
- Duplicate username prevention
- Password validation

### Chat Functionality
- Message creation
- Message retrieval with sorting
- Authenticated message posting
- Unauthorized access prevention

### Middleware
- Authentication middleware validation
- Protected route access
- Redirect functionality

### Integration
- Full API flows
- Session management
- Error handling across layers

## Next Steps Before Deployment

Before pushing to production:
1. Run full test suite: `npm test`
2. Check test coverage: `npm run test:coverage`
3. Fix any failing tests
4. Add additional tests for edge cases as needed

## Note on MongoDB Connection

Tests connect to MongoDB at `mongodb://localhost:27017/chat-app-test` by default.
You can override this with the `MONGODB_TEST_URI` environment variable:

```bash
MONGODB_TEST_URI=your_test_db_uri npm test
```

Ensure MongoDB is running before executing tests.
