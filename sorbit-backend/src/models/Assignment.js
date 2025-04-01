// src/models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dueDate: {
    type: Date,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  questions: [{
    question: String,
    answer: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to generate a random code
assignmentSchema.statics.generateCode = function() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
};

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;