// tests/unit/middleware/auth.test.js
const jwt = require('jsonwebtoken');
const config = require('../../../src/config');

// Define mocks before requiring the module
jest.mock('jsonwebtoken');
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn()
    }
  }
}));

// Mock the User model BEFORE requiring auth middleware
jest.mock('../../../src/models/User', () => ({
  findById: jest.fn()
}));

// Now require the auth middleware which depends on the mocked modules
const { authenticate, authorize } = require('../../../src/middleware/auth');
const User = require('../../../src/models/User');
const mongoose = require('mongoose');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;
  let originalNodeEnv;
  
  // Save original NODE_ENV before tests
  beforeAll(() => {
    originalNodeEnv = process.env.NODE_ENV;
  });
  
  // Restore original NODE_ENV after tests
  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      headers: {}
    };
    
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };
    
    next = jest.fn();
    
    // Reset NODE_ENV to non-test for most tests
    process.env.NODE_ENV = 'development';
  });
  
  describe('authenticate middleware', () => {
    it('should bypass database in test mode', async () => {
      // Set NODE_ENV to test for this test
      process.env.NODE_ENV = 'test';
      
      // Setup request with auth header
      req.headers.authorization = 'Bearer valid-token';
      
      // Mock jwt.verify to return decoded token
      const mockDecodedToken = { 
        id: 'test-user-id', 
        role: 'student', 
        email: 'test@example.com' 
      };
      jwt.verify.mockReturnValue(mockDecodedToken);
      
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify jwt.verify was called with the token
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwtSecret);
      
      // Verify User.findById was NOT called in test mode
      expect(User.findById).not.toHaveBeenCalled();
      
      // Verify user was added to request with data from token
      expect(req.user).toEqual({
        _id: 'test-user-id',
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student'
      });
      
      // Verify next was called
      expect(next).toHaveBeenCalled();
    });
    
    it('should call next() with a valid token and user in development mode', async () => {
      // Setup request with auth header
      req.headers.authorization = 'Bearer valid-token';
      
      // Mock jwt.verify to return decoded token
      const mockDecodedToken = { id: 'user-id', role: 'student' };
      jwt.verify.mockReturnValue(mockDecodedToken);
      
      // Mock mongoose.Types.ObjectId.isValid to return true
      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      
      // Mock User.findById
      const mockUser = { _id: 'user-id', name: 'Test User', role: 'student' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify jwt.verify was called with the token
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwtSecret);
      
      // Verify mongoose.Types.ObjectId.isValid was called
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith('user-id');
      
      // Verify User.findById was called with the user ID
      expect(User.findById).toHaveBeenCalledWith('user-id');
      
      // Verify user was added to request
      expect(req.user).toEqual(mockUser);
      
      // Verify next was called
      expect(next).toHaveBeenCalled();
    });
    
    it('should return 401 if no authorization header', async () => {
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication required'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 401 if authorization header is not Bearer', async () => {
      // Setup request with invalid auth header
      req.headers.authorization = 'NotBearer token';
      
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication required'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 401 if token verification fails', async () => {
      // Setup request with auth header
      req.headers.authorization = 'Bearer invalid-token';
      
      // Mock jwt.verify to throw error
      jwt.verify.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });
      
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid token'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 401 if token is expired', async () => {
      // Setup request with auth header
      req.headers.authorization = 'Bearer expired-token';
      
      // Mock jwt.verify to throw token expired error
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });
      
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Token expired'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 401 if user is not found in development mode', async () => {
      // Setup request with auth header
      req.headers.authorization = 'Bearer valid-token';
      
      // Mock jwt.verify to return decoded token
      const mockDecodedToken = { id: 'nonexistent-user-id' };
      jwt.verify.mockReturnValue(mockDecodedToken);
      
      // Mock mongoose.Types.ObjectId.isValid to return true
      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      
      // Mock User.findById to return null
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });
      
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User not found'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 401 if ID is invalid ObjectId format', async () => {
      // Setup request with auth header
      req.headers.authorization = 'Bearer valid-token';
      
      // Mock jwt.verify to return decoded token with invalid ObjectId
      const mockDecodedToken = { id: 'invalid-format-id' };
      jwt.verify.mockReturnValue(mockDecodedToken);
      
      // Mock mongoose.Types.ObjectId.isValid to return false
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);
      
      // Call the middleware
      await authenticate(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid user ID format'
      }));
      expect(next).not.toHaveBeenCalled();
    });
  });
  
  describe('authorize middleware', () => {
    it('should call next() if user has the required role', () => {
      // Setup request with user
      req.user = { role: 'teacher' };
      
      // Create authorize middleware for 'teacher' role
      const teacherAuth = authorize('teacher');
      
      // Call the middleware
      teacherAuth(req, res, next);
      
      // Verify next was called
      expect(next).toHaveBeenCalled();
    });
    
    it('should call next() if user has one of the required roles', () => {
      // Setup request with user
      req.user = { role: 'admin' };
      
      // Create authorize middleware for multiple roles
      const multiRoleAuth = authorize('teacher', 'admin');
      
      // Call the middleware
      multiRoleAuth(req, res, next);
      
      // Verify next was called
      expect(next).toHaveBeenCalled();
    });
    
    it('should return 401 if user is not authenticated', () => {
      // Create authorize middleware
      const teacherAuth = authorize('teacher');
      
      // Call the middleware
      teacherAuth(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Authentication required'
      }));
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should return 403 if user does not have the required role', () => {
      // Setup request with user
      req.user = { role: 'student' };
      
      // Create authorize middleware for 'teacher' role
      const teacherAuth = authorize('teacher');
      
      // Call the middleware
      teacherAuth(req, res, next);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'You do not have permission to perform this action'
      }));
      expect(next).not.toHaveBeenCalled();
    });
  });
});