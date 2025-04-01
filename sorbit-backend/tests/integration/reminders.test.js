// tests/integration/reminders.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const config = require('../../src/config');

describe('Reminders API', () => {
  let authToken;
  
  // Before all tests, set NODE_ENV to test
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  
  // Before running tests, login as student
  beforeEach(() => {
    // Generate token directly for test user
    authToken = jwt.sign(
      { id: '123', role: 'student', email: 'student@test.com' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });
  
  describe('GET /api/reminders', () => {
    it('should return a list of reminders for the student', async () => {
      const response = await request(app)
        .get('/api/reminders')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('reminders');
      expect(Array.isArray(response.body.reminders)).toBe(true);
    });
  });
  
  describe('POST /api/reminders', () => {
    it('should create a new reminder', async () => {
      const newReminder = {
        title: 'Math Homework',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Complete algebra problems'
      };
      
      const response = await request(app)
        .post('/api/reminders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newReminder);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', newReminder.title);
      expect(response.body).toHaveProperty('dueDate');
    });
  });
  
  describe('PUT /api/reminders/:id/status', () => {
    it('should toggle reminder completion status', async () => {
      // First create a reminder
      const createResponse = await request(app)
        .post('/api/reminders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Science Project',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        });
      
      const reminderId = createResponse.body.id;
      
      // Now toggle its status
      const response = await request(app)
        .put(`/api/reminders/${reminderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ complete: true });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('complete', true);
    });
    
    it('should reject updating reminders that don\'t belong to the user', async () => {
      const response = await request(app)
        .put('/api/reminders/unauthorized-id/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ complete: true });
      
      expect(response.status).toBe(404);
    });
  });
});