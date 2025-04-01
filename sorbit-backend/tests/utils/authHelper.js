// tests/utils/authHelper.js
const jwt = require('jsonwebtoken');
const config = require('../../src/config');
const User = require('../../src/models/User');

/**
 * Standard test user with valid ObjectId format
 */
const TEST_USER = {
  _id: '507f1f77bcf86cd799439011', // Valid ObjectId format
  id: '507f1f77bcf86cd799439011',  // Valid ObjectId format
  name: 'Test Student',
  email: 'student@test.com',
  role: 'student'
};

/**
 * Generate a valid JWT token for testing
 * @param {Object} user - User object to encode in token
 * @param {string} expiresIn - Token expiration (default: '1h')
 * @returns {string} JWT token
 */
function generateTestToken(user = TEST_USER, expiresIn = '1h') {
  return jwt.sign(
    { 
      id: user._id || user.id, 
      role: user.role 
    },
    config.jwtSecret,
    { expiresIn }
  );
}

/**
 * Setup mocks for User model to support auth middleware in tests
 */
function setupUserMocks() {
  // Clear any existing mocks
  if (typeof User.mockClear === 'function') {
    User.mockClear();
  }
  
  // Mock User.findById to return test user
  User.findById = jest.fn().mockImplementation((id) => {
    if (id === TEST_USER._id || id === TEST_USER.id) {
      return {
        select: jest.fn().mockResolvedValue(TEST_USER)
      };
    }
    return {
      select: jest.fn().mockResolvedValue(null)
    };
  });
}

module.exports = {
  TEST_USER,
  generateTestToken,
  setupUserMocks
};