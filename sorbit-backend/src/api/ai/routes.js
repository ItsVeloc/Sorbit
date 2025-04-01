// src/api/ai/routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const AiService = require('../../services/AiService');

// Send message to AI
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { assignmentId, message } = req.body;
    
    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }
    
    const response = await AiService.sendMessage(
      req.user.id,
      assignmentId,
      message
    );
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat history
router.get('/chat/history', authenticate, async (req, res) => {
  try {
    const { assignmentId } = req.query;
    
    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }
    
    const messages = await AiService.getChatHistory(
      req.user.id,
      assignmentId
    );
    
    res.json({ messages: messages || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit feedback
router.post('/feedback', authenticate, (req, res) => {
  const { messageId, helpful, comment } = req.body;
  
  // In a real implementation, this would store the feedback
  res.json({ message: 'Feedback received' });
});

module.exports = router;