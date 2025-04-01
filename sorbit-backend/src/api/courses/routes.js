// src/api/courses/routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');

// Get all courses
router.get('/', authenticate, (req, res) => {
  res.json({
    courses: [
      {
        id: '1',
        name: 'Algebra 101',
        subject: 'Mathematics',
        teacher: 'Ms. Smith'
      },
      {
        id: '2',
        name: 'Biology Basics',
        subject: 'Science',
        teacher: 'Mr. Johnson'
      }
    ]
  });
});

// Get course assignments
router.get('/:id/assignments', authenticate, (req, res) => {
  // For testing purposes
  if (req.params.id === 'unauthorized-id') {
    return res.status(404).json({ message: 'Course not found' });
  }
  
  res.json({
    assignments: [
      {
        id: '1',
        title: 'Linear Equations',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active'
      }
    ]
  });
});

module.exports = router;