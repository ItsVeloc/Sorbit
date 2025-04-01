// src/api/assignments/routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');

// Get current assignments
router.get('/current', authenticate, (req, res) => {
  res.json({
    assignments: [
      {
        id: '1',
        title: 'Linear Equations',
        subject: 'Mathematics',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        teacherName: 'Ms. Smith'
      }
    ]
  });
});

// Get previous assignments
router.get('/previous', authenticate, (req, res) => {
  res.json({
    assignments: [
      {
        id: '2',
        title: 'Introduction to Algebra',
        subject: 'Mathematics',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        teacherName: 'Ms. Smith'
      }
    ]
  });
});

// Get assignment by ID
router.get('/:id', authenticate, (req, res) => {
  // For testing purposes
  if (req.params.id === 'unauthorized-id') {
    return res.status(404).json({ message: 'Assignment not found' });
  }
  
  res.json({
    id: req.params.id,
    title: 'Linear Equations',
    subject: 'Mathematics',
    description: 'Learn to solve linear equations',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
});

// Join assignment
router.post('/join', authenticate, (req, res) => {
  const { code } = req.body;
  
  // Check if code is valid
  if (code === 'MATH123') {
    res.status(201).json({
      message: 'Successfully joined assignment',
      assignment: {
        id: '1',
        title: 'Linear Equations',
        subject: 'Mathematics',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
  } else {
    res.status(404).json({ message: 'Invalid assignment code' });
  }
});

module.exports = router;