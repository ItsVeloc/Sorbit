// src/api/calendar/routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');

// Get calendar events
router.get('/', authenticate, (req, res) => {
  res.json({
    events: [
      {
        id: '1',
        title: 'Math Assignment Due',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignmentId: '1'
      }
    ]
  });
});

module.exports = router;