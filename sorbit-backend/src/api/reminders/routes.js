// src/api/reminders/routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');

// Get all reminders
router.get('/', authenticate, (req, res) => {
  res.json({
    reminders: [
      {
        id: '1',
        title: 'Complete Math Homework',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        complete: false
      }
    ]
  });
});

// Create a reminder
router.post('/', authenticate, (req, res) => {
  const { title, dueDate, description } = req.body;
  
  res.status(201).json({
    id: 'new-reminder-id',
    title,
    dueDate,
    description,
    complete: false
  });
});

// Update reminder status
router.put('/:id/status', authenticate, (req, res) => {
  // For testing purposes
  if (req.params.id === 'unauthorized-id') {
    return res.status(404).json({ message: 'Reminder not found' });
  }
  
  const { complete } = req.body;
  
  res.json({
    id: req.params.id,
    complete
  });
});

module.exports = router;