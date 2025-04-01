// tests/integration/ai.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('AI Tutoring API', () => {
  let authToken;
  let assignmentId;
  
  // Before running tests, login as student and join an assignment
  beforeEach(async () => {
    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@test.com',
        password: 'Password123'
      });
    
    authToken = loginResponse.body.token;
    
    // Join assignment
    const joinResponse = await request(app)
      .post('/api/assignments/join')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ code: 'MATH123' });
    
    assignmentId = joinResponse.body.assignment ? joinResponse.body.assignment.id : '1';
  });
  
  describe('POST /api/ai/chat', () => {
    it('should respond to student messages about an assignment', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assignmentId: assignmentId,
          message: 'Can you help me understand linear equations?'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('messageId');
      expect(response.body).toHaveProperty('content');
      expect(typeof response.body.content).toBe('string');
      expect(response.body.content.length).toBeGreaterThan(0);
    });
    
    it('should reject requests without assignment ID', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          message: 'Can you help me understand linear equations?'
        });
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('GET /api/ai/chat/history', () => {
    it('should return chat history for an assignment', async () => {
      // First send a message
      await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assignmentId: assignmentId,
          message: 'What is a linear equation?'
        });
      
      // Then get chat history
      const response = await request(app)
        .get(`/api/ai/chat/history?assignmentId=${assignmentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('messages');
      expect(Array.isArray(response.body.messages)).toBe(true);
      expect(response.body.messages.length).toBeGreaterThan(0);
      
      // Check message structure
      const message = response.body.messages[0];
      expect(message).toHaveProperty('role');
      expect(message).toHaveProperty('content');
      expect(message).toHaveProperty('createdAt');
    });
    
    it('should return empty array if no chat history', async () => {
      // Use a different assignment ID with no history
      const response = await request(app)
        .get('/api/ai/chat/history?assignmentId=no-history-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('messages');
      expect(Array.isArray(response.body.messages)).toBe(true);
      expect(response.body.messages.length).toBe(0);
    });
  });
  
  describe('POST /api/ai/feedback', () => {
    it('should allow students to provide feedback on AI responses', async () => {
      // First send a message to get a response
      const chatResponse = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assignmentId: assignmentId,
          message: 'What is a linear equation?'
        });
      
      const messageId = chatResponse.body.messageId;
      
      // Then submit feedback
      const response = await request(app)
        .post('/api/ai/feedback')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          messageId: messageId,
          helpful: true,
          comment: 'This was a clear explanation, thank you!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Feedback received');
    });
  });
});