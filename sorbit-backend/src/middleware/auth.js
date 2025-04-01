// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.authenticate = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // For testing purposes, accept any token
    // In production, you would verify the token
    req.user = {
      id: '123',
      name: 'Test Student',
      email: 'student@test.com',
      role: 'student'
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};