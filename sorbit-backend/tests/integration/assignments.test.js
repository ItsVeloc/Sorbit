// tests/integration/assignments.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const config = require('../../src/config');
const User = require('../../src/models/User');

// Mock User model for the authentication to work
jest.mock('../../src/models/User', () => {
  return {
    findOne: jest.fn(),
    findById: jest.fn()
  };
});

describe('Assignments API', () => {
  // Test data
  const testUser = {
    _id: '507f1f77bcf86cd799439011', // Valid ObjectId format (24 hex chars)
    id: '507f1f77bcf86cd799439011',  // Valid ObjectId format
    name: 'Test Student',
    email: 'student@test.com',
    role: 'student'
  };
  
  let authToken;
  
  // Before running tests, set NODE_ENV to test
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  
  // Set up token before each test
  beforeEach(() => {
    // Generate a valid token for our test user
    authToken = jwt.sign(
      { id: testUser._id, role: testUser.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });
  
  describe('GET /api/assignments/current', () => {
    it('should return student\'s current assignments when authenticated', async () => {
      const response = await request(app)
        .get('/api/assignments/current')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assignments');
      expect(Array.isArray(response.body.assignments)).toBe(true);
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/assignments/current');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authentication required');
    });
    
    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/assignments/current')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/assignments/previous', () => {
    it('should return student\'s previous assignments when authenticated', async () => {
      const response = await request(app)
        .get('/api/assignments/previous')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assignments');
      expect(Array.isArray(response.body.assignments)).toBe(true);
    });
  });
  
  describe('POST /api/assignments/join', () => {
    it('should allow student to join an assignment with valid code when authenticated', async () => {
      const response = await request(app)
        .post('/api/assignments/join')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'MATH123' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('assignment');
    });
    
    it('should reject joining with invalid code', async () => {
      const response = await request(app)
        .post('/api/assignments/join')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'INVALID' });
      
      expect(response.status).toBe(404);
    });
    
    it('should reject joining when not authenticated', async () => {
      const response = await request(app)
        .post('/api/assignments/join')
        .send({ code: 'MATH123' });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/assignments/:id', () => {
    it('should return assignment details when authenticated', async () => {
      const response = await request(app)
        .get('/api/assignments/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('subject');
    });
    
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/assignments/1');
      
      expect(response.status).toBe(401);
    });
  });
});