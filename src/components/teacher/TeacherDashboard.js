// components/teacher/TeacherDashboard.js
import React, { useState } from 'react';
import AssignmentForm from './AssignmentForm';
import AssignmentList from './AssignmentList';
import ConversationList from './ConversationList';
import ConversationViewer from './ConversationViewer';

const TeacherDashboard = ({ activeTab }) => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  
  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };
  
  const handleBackToConversations = () => {
    setSelectedConversationId(null);
  };
  
  // Render different content based on active tab
  const renderContent = () => {
    if (activeTab === 'create') {
      return <AssignmentForm />;
    } else if (activeTab === 'list') {
      return <AssignmentList />;
    } else if (activeTab === 'conversations') {
      if (selectedConversationId) {
        return (
          <ConversationViewer 
            conversationId={selectedConversationId} 
            onBack={handleBackToConversations} 
          />
        );
      } else {
        return <ConversationList onSelectConversation={handleSelectConversation} />;
      }
    }
    
    // Default fallback
    return <AssignmentForm />;
  };
  
  return (
    <div className="teacher-dashboard">
      {renderContent()}
    </div>
  );
};

export default TeacherDashboard;