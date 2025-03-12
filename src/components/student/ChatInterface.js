// src/components/student/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { generateAiResponse, generateSimulatedResponse } from '../../utils/aiService';

const ChatInterface = ({ assignment }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [useApi, setUseApi] = useState(true); // Toggle for demo purposes

  // Initialize chat with a greeting from the AI
  useEffect(() => {
    const initializeChat = async () => {
      setIsAiTyping(true);
      try {
        let aiGreeting;
        
        if (useApi) {
          // Try to use the API first
          aiGreeting = await generateAiResponse('', assignment, []);
        } else {
          // Fall back to simulation if API is disabled
          aiGreeting = generateSimulatedResponse('', assignment);
        }
        
        setMessages([{ sender: 'ai', text: aiGreeting }]);
        setError(null);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError('Failed to connect to AI tutor. Please try again.');
      } finally {
        setIsAiTyping(false);
      }
    };
    
    initializeChat();
  }, [assignment, useApi]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = input.trim();
    const updatedMessages = [...messages, { sender: 'user', text: userMessage }];
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
      
      setMessages(prevMessages => [
        ...prevMessages, 
        { sender: 'ai', text: aiResponse }
      ]);
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

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>AI Tutor Chat</h3>
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