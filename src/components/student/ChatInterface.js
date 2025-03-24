// src/components/student/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { generateAiResponse, generateSimulatedResponse } from '../../utils/aiService';
import { saveConversation } from '../../utils/conversationStorage';

const ChatInterface = ({ assignment }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const messagesEndRef = useRef(null);
  const [useApi, setUseApi] = useState(true); // Toggle for demo purposes

  // Initialize chat with a student name prompt
  useEffect(() => {
    if (!studentName) {
      setMessages([{ 
        sender: 'ai', 
        text: 'Welcome! Please enter your name to begin this assignment.', 
        timestamp: new Date().toISOString() 
      }]);
    }
  }, [studentName]);

  // Initialize conversation when student name is submitted
  useEffect(() => {
    if (nameSubmitted && studentName) {
      const initializeChat = async () => {
        setIsAiTyping(true);
        
        // Create a new conversation ID
        const newConversationId = Date.now().toString();
        setConversationId(newConversationId);
        
        try {
          let aiGreeting;
          
          if (useApi) {
            // Try to use the API first
            aiGreeting = await generateAiResponse('', assignment, []);
          } else {
            // Fall back to simulation if API is disabled
            aiGreeting = generateSimulatedResponse('', assignment);
          }
          
          const greetingMessage = { 
            sender: 'ai', 
            text: aiGreeting, 
            timestamp: new Date().toISOString() 
          };
          
          // Get current messages and append the greeting
          const updatedMessages = [...messages, greetingMessage];
          setMessages(updatedMessages);
          
          // Save initial conversation
          saveConversation({
            id: newConversationId,
            assignmentId: assignment.id,
            assignmentCode: assignment.code,
            assignmentTitle: assignment.title,
            studentName: studentName,
            timestamp: new Date().toISOString(),
            messages: updatedMessages
          });
          
          setError(null);
        } catch (error) {
          console.error('Error initializing chat:', error);
          setError('Failed to connect to AI tutor. Please try again.');
        } finally {
          setIsAiTyping(false);
        }
      };
      
      initializeChat();
    }
  }, [nameSubmitted, studentName, assignment, useApi]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (studentName.trim()) {
      setNameSubmitted(true);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = input.trim();
    const userMessageObj = { 
      sender: 'user', 
      text: userMessage, 
      timestamp: new Date().toISOString() 
    };
    const updatedMessages = [...messages, userMessageObj];
    setMessages(updatedMessages);
    setInput('');
    setError(null);
    
    // Show AI is typing
    setIsAiTyping(true);
    
    try {
      let aiResponse;
      
      if (useApi) {
        // Use API with the full chat history for context
        aiResponse = await generateAiResponse(
          userMessage, 
          assignment,
          updatedMessages.slice(0, -1) // Exclude the message we just added
        );
      } else {
        // Use simulation for demo or if API fails
        aiResponse = generateSimulatedResponse(userMessage, assignment);
        // Add a slight delay to simulate network latency
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const aiMessageObj = { 
        sender: 'ai', 
        text: aiResponse, 
        timestamp: new Date().toISOString() 
      };
      
      const newMessages = [...updatedMessages, aiMessageObj];
      setMessages(newMessages);
      
      // Save updated conversation
      saveConversation({
        id: conversationId,
        assignmentId: assignment.id,
        assignmentCode: assignment.code,
        assignmentTitle: assignment.title,
        studentName: studentName,
        timestamp: new Date().toISOString(),
        messages: newMessages
      });
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Failed to get response from AI tutor. Please try again.');
    } finally {
      setIsAiTyping(false);
    }
  };

  // Toggle between API and simulation (for demo purposes)
  const toggleApiMode = () => {
    setUseApi(!useApi);
  };

  // Render student name form if name not yet submitted
  if (!nameSubmitted) {
    return (
      <div className="chat-interface">
        <div className="chat-header">
          <h3>AI Tutor Chat</h3>
        </div>
        
        <div className="chat-messages">
          <div className="message ai-message">
            <div className="message-bubble">
              Welcome! Please enter your name to begin this assignment.
            </div>
          </div>
        </div>
        
        <form className="chat-input" onSubmit={handleNameSubmit}>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit" disabled={!studentName.trim()}>
            Start
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>AI Tutor Chat</h3>
        <div className="student-info">Student: {studentName}</div>
        <div className="api-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={useApi} 
              onChange={toggleApiMode}
            />
            Use API (uncheck for demo mode)
          </label>
        </div>
      </div>
      
      <div className="chat-messages">
        {error && (
          <div className="message system-message">
            <div className="message-bubble error">
              {error}
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-bubble">
              {message.text}
            </div>
          </div>
        ))}
        
        {isAiTyping && (
          <div className="message ai-message">
            <div className="message-bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isAiTyping}
        />
        <button type="submit" disabled={isAiTyping || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;