// components/teacher/AssignmentForm.js
import React, { useState, useContext } from 'react';
import { AssignmentContext } from '../../contexts/AssignmentContext';

const AssignmentForm = () => {
  const { createAssignment } = useContext(AssignmentContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    questions: [{ question: '', answer: '' }]
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', answer: '' }]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAssignment = createAssignment(formData);
    setSuccessMessage(`Assignment created! Code: ${newAssignment.code}`);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      questions: [{ question: '', answer: '' }]
    });
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <div className="assignment-form-container">
      <h2>Create New Assignment</h2>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      <form className="assignment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        
        <div className="questions-section">
          <h3>Sample Questions</h3>
          <p className="hint">
            These questions help guide the AI in testing the student's understanding.
          </p>
          
          {formData.questions.map((q, index) => (
            <div key={index} className="question-item">
              <div className="form-group">
                <label>Question {index + 1}</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => 
                    handleQuestionChange(index, 'question', e.target.value)
                  }
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Sample Answer</label>
                <textarea
                  value={q.answer}
                  onChange={(e) => 
                    handleQuestionChange(index, 'answer', e.target.value)
                  }
                  rows="2"
                  required
                ></textarea>
              </div>
              
              {formData.questions.length > 1 && (
                <button
                  type="button"
                  className="remove-question"
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-question"
            onClick={addQuestion}
          >
            + Add Another Question
          </button>
        </div>
        
        <button type="submit" className="submit-button">
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentForm;