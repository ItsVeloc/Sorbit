// components/teacher/ConversationViewer.js
import React from 'react';
import { format } from 'date-fns';
import { getConversationById } from '../../utils/conversationStorage';

const ConversationViewer = ({ conversationId, onBack }) => {
  const conversation = getConversationById(conversationId);
  
  if (!conversation) {
    return (
      <div className="conversation-viewer">
        <div className="viewer-header">
          <button className="back-button" onClick={onBack}>
            ← Back to conversations
          </button>
          <h3>Conversation not found</h3>
        </div>
        <div className="conversation-not-found">
          <p>The requested conversation could not be found.</p>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm:ss a');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="conversation-viewer">
      <div className="viewer-header">
        <button className="back-button" onClick={onBack}>
          ← Back to conversations
        </button>
        <h3>Conversation Details</h3>
      </div>
      
      <div className="conversation-info">
        <div className="info-item">
          <span className="info-label">Assignment:</span>
          <span className="info-value">{conversation.assignmentTitle} ({conversation.assignmentCode})</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Student:</span>
          <span className="info-value">{conversation.studentName}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Date:</span>
          <span className="info-value">{formatDate(conversation.timestamp)}</span>
        </div>
      </div>
      
      <div className="conversation-transcript">
        <h4>Transcript</h4>
        
        <div className="transcript-messages">
          {conversation.messages.map((message, index) => (
            <div 
              key={index} 
              className={`transcript-message ${message.sender}`}
            >
              <div className="message-header">
                <span className="message-sender">
                  {message.sender === 'user' ? conversation.studentName : 'AI Tutor'}
                </span>
                <span className="message-time">
                  {message.timestamp ? formatDate(message.timestamp) : ''}
                </span>
              </div>
              <div className="message-text">
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationViewer;