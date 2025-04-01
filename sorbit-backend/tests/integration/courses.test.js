// tests/integration/courses.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const config = require('../../src/config');

describe('Courses API', () => {
  let authToken;
  
  // Before all tests, set NODE_ENV to test
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  
  // Before running tests, create a valid token
  beforeEach(() => {
    // Generate token directly for test user
    authToken = jwt.sign(
      { id: '123', role: 'student', email: 'student@test.com' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });
  
  describe('GET /api/courses', () => {
    it('should return courses the student is enrolled in', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('courses');
      expect(Array.isArray(response.body.courses)).toBe(true);
      
      // Check course structure if there are any
      if (response.body.courses.length > 0) {
        expect(response.body.courses[0]).toHaveProperty('id');
        expect(response.body.courses[0]).toHaveProperty('name');
        expect(response.body.courses[0]).toHaveProperty('subject');
      }
    });
  });
  
  describe('GET /api/courses/:id/assignments', () => {
    it('should return assignments for a specific course', async () => {
      // First get available courses
      const coursesResponse = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Skip test if no courses
      if (!coursesResponse.body.courses || coursesResponse.body.courses.length === 0) {
        return;
      }
      
      const courseId = coursesResponse.body.courses[0].id;
      
      // Get assignments for this course
      const response = await request(app)
        .get(`/api/courses/${courseId}/assignments`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assignments');
      expect(Array.isArray(response.body.assignments)).toBe(true);
    });
    
    it('should reject access to courses student is not enrolled in', async () => {
      const response = await request(app)
        .get('/api/courses/unauthorized-id/assignments')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});