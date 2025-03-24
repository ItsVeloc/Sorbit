// src/utils/conversationStorage.js
export const saveConversation = (conversation) => {
  // Get existing conversations from localStorage
  const conversations = getConversations();
  
  // Add the new conversation
  conversations.push(conversation);
  
  // Save back to localStorage
  localStorage.setItem('conversations', JSON.stringify(conversations));
};

export const getConversations = () => {
  const conversations = localStorage.getItem('conversations');
  return conversations ? JSON.parse(conversations) : [];
};

export const getConversationsByAssignment = (assignmentId) => {
  const conversations = getConversations();
  return conversations.filter(conv => conv.assignmentId === assignmentId);
};

export const getConversationById = (conversationId) => {
  const conversations = getConversations();
  return conversations.find(conv => conv.id === conversationId);
};