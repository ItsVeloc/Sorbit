// tests/integration/assignments.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Assignments API', () => {
  // Test data
  let authToken;
  
  // Before running tests, login as student
  beforeEach(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@test.com',
        password: 'Password123'
      });
    
    authToken = loginResponse.body.token;
  });
  
  describe('GET /api/assignments/current', () => {
    it('should return student\'s current assignments', async () => {
      const response = await request(app)
        .get('/api/assignments/current')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assignments');
      expect(Array.isArray(response.body.assignments)).toBe(true);
    });
  });
  
  describe('GET /api/assignments/previous', () => {
    it('should return student\'s previous assignments', async () => {
      const response = await request(app)
        .get('/api/assignments/previous')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assignments');
      expect(Array.isArray(response.body.assignments)).toBe(true);
    });
  });
  
  describe('POST /api/assignments/join', () => {
    it('should allow student to join an assignment with valid code', async () => {
      const response = await request(app)
        .post('/api/assignments/join')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'MATH123' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('assignment');
    });
    
    it('should reject invalid assignment codes', async () => {
      const response = await request(app)
        .post('/api/assignments/join')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'INVALID' });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /api/assignments/:id', () => {
    it('should return assignment details', async () => {
      const response = await request(app)
        .get('/api/assignments/1')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('subject');
    });
  });
});