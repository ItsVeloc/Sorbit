// tests/integration/auth.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const config = require('../../src/config');

// No need to mock User model for integration tests as we're using test mode

describe('Auth API', () => {
  // Test user data
  const testUser = {
    _id: '507f1f77bcf86cd799439011', // Valid ObjectId format (24 hex chars)
    id: '507f1f77bcf86cd799439011',  // Valid ObjectId format
    name: 'Test Student',
    email: 'student@test.com',
    password: 'Password123',
    role: 'student'
  };
  
  let authToken;
  
  // Before all tests, set NODE_ENV to test
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return a JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('role', 'student');
      
      // Verify token is valid JWT
      const decodedToken = jwt.verify(response.body.token, config.jwtSecret);
      expect(decodedToken).toHaveProperty('id');
      expect(decodedToken).toHaveProperty('role', testUser.role);
      
      // Save token for subsequent tests
      authToken = response.body.token;
    });
    
    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
    
    it('should reject login with missing email or password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
          // Missing password
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@test.com',
          password: 'Password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'newuser@test.com');
    });
    
    it('should reject registration if user already exists', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: testUser.name,
          email: testUser.email,
          password: 'Password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });
  });
  
  describe('GET /api/auth/profile', () => {
    it('should return the user profile when authenticated', async () => {
      // First login to get a valid token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      authToken = loginResponse.body.token;
      
      // Now get the profile
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      // In test mode, the profile comes from the token, not the database
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role', testUser.role);
    });
    
    it('should reject unauthenticated profile requests', async () => {
      const response = await request(app)
        .get('/api/auth/profile');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authentication required');
    });
    
    it('should reject requests with invalid tokens', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('POST /api/auth/refresh-token', () => {
    it('should issue a new token when given a valid token', async () => {
      // First login to get a valid token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      const oldToken = loginResponse.body.token;
      
      // Now try to refresh it
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ token: oldToken });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      
      // Verify it's a valid JWT
      const decodedToken = jwt.verify(response.body.token, config.jwtSecret);
      
      // Verify it's a different token
      expect(response.body.token).not.toBe(oldToken);
    });
    
    it('should reject refresh requests with invalid tokens', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ token: 'invalid-token' });
      
      expect(response.status).toBe(401);
    });
    
    it('should reject refresh requests without a token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({});
      
      expect(response.status).toBe(400);
    });
  });
});