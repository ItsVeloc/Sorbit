// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Auth API', () => {
  // Test user data
  const testUser = {
    name: 'Test Student',
    email: 'student@test.com',
    password: 'Password123',
    role: 'student'
  };
  
  let authToken;
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
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
      
      // Save token for subsequent tests
      authToken = response.body.token;
    });
    
    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      authToken = loginResponse.body.token;
      
      // Then fetch profile
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role');
    });
    
    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/auth/profile');
      
      expect(response.status).toBe(401);
    });
  });
});