// components/teacher/ConversationList.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getConversations } from '../../utils/conversationStorage';

const ConversationList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [filterAssignment, setFilterAssignment] = useState('');
  const [filterStudent, setFilterStudent] = useState('');
  
  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = () => {
      const allConversations = getConversations();
      setConversations(allConversations);
    };
    
    loadConversations();
    
    // Set up event listener for localStorage changes
    const handleStorageChange = () => {
      loadConversations();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  // Filter conversations based on selected filters
  const filteredConversations = conversations.filter(conversation => {
    const matchesAssignment = !filterAssignment || 
      conversation.assignmentCode === filterAssignment;
    const matchesStudent = !filterStudent || 
      conversation.studentName.toLowerCase().includes(filterStudent.toLowerCase());
    return matchesAssignment && matchesStudent;
  });
  
  // Get unique assignment codes for the filter dropdown
  const uniqueAssignmentCodes = [...new Set(conversations.map(c => c.assignmentCode))];
  
  return (
    <div className="conversation-list-container">
      <h2>Student Conversations</h2>
      
      <div className="conversation-filters">
        <div className="filter-group">
          <label htmlFor="assignmentFilter">Assignment:</label>
          <select
            id="assignmentFilter"
            value={filterAssignment}
            onChange={(e) => setFilterAssignment(e.target.value)}
          >
            <option value="">All Assignments</option>
            {uniqueAssignmentCodes.map(code => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="studentFilter">Student:</label>
          <input
            id="studentFilter"
            type="text"
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            placeholder="Filter by student name"
          />
        </div>
      </div>
      
      {filteredConversations.length === 0 ? (
        <div className="no-conversations">
          <p>No conversations found.</p>
        </div>
      ) : (
        <div className="conversation-cards">
          {filteredConversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className="conversation-card"
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="conversation-header">
                <span className="assignment-code">{conversation.assignmentCode}</span>
                <span className="assignment-title">{conversation.assignmentTitle}</span>
              </div>
              
              <div className="conversation-details">
                <p className="student-name">
                  <strong>Student:</strong> {conversation.studentName}
                </p>
                <p className="conversation-date">
                  <strong>Date:</strong> {formatDate(conversation.timestamp)}
                </p>
                <p className="message-count">
                  <strong>Messages:</strong> {conversation.messages.length}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationList;