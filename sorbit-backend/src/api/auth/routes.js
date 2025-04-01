// src/api/auth/routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../config');

// Login endpoint
router.post('/login', (req, res) => {
  // Simple implementation for testing
  const { email, password } = req.body;
  
  if (email === 'student@test.com' && password === 'Password123') {
    // Generate token
    const token = jwt.sign(
      { id: '123', role: 'student' },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: '123',
        name: 'Test Student',
        email: 'student@test.com',
        role: 'student'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Other auth endpoints remain the same...
// Register endpoint
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // In a real implementation, we would validate input and create a user
  // For now, just return success for testing
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please login.',
    user: {
      id: 'new-user-id',
      name,
      email,
      role
    }
  });
});

// Get user profile
router.get('/profile', (req, res, next) => {
  // This would normally check the JWT token
  // For now, respond with mock data
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  res.json({
    id: '123',
    name: 'Test Student',
    email: 'student@test.com',
    role: 'student'
  });
});



module.exports = router;