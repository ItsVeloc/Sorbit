// components/student/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ assignment }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Simulated AI service for the MVP
  const simulateAiResponse = (userMessage, assignment) => {
    return new Promise((resolve) => {
      setIsAiTyping(true);
      
      // For the demo, we'll use a simple rule-based response system
      // In the real application, this would call an LLM API
      setTimeout(() => {
        let response;
        
        // Initial greeting if this is the first message
        if (messages.length === 0) {
          response = `Hi there! I'm your AI tutor for the "${assignment.title}" assignment. 
                     Let's work through this together. What do you already know about this topic?`;
        }
        // Check if the user's message contains keywords from the assignment
        else if (userMessage.toLowerCase().includes('help') || 
                userMessage.toLowerCase().includes('stuck')) {
          response = `I'm happy to help! Let's break down the assignment: "${assignment.description}"
                     Would you like me to explain any specific part of this topic?`;
        }
        // If we have sample questions, use them after a few exchanges
        else if (assignment.questions && assignment.questions.length > 0 && 
                messages.length >= 4 && messages.length % 3 === 0) {
          // Pick a random question from the assignment
          const randomIndex = Math.floor(Math.random() * assignment.questions.length);
          const question = assignment.questions[randomIndex];
          response = `Let's test your understanding. ${question.question}`;
        }
        // Generic responses for other cases
        else {
          const genericResponses = [
            `That's interesting. Let's explore this further. Can you elaborate on your thoughts about ${assignment.subject}?`,
            `Good point. In the context of this assignment, how would you apply this concept?`,
            `I see. Based on "${assignment.description}", what do you think is the most important aspect to focus on?`,
            `Great progress! Let's try approaching this from another angle. What if we consider...`,
            `You're on the right track. Let's dig deeper into this topic.`
          ];
          const randomIndex = Math.floor(Math.random() * genericResponses.length);
          response = genericResponses[randomIndex];
        }
        
        setIsAiTyping(false);
        resolve(response);
      }, 1000 + Math.random() * 2000); // Random delay to simulate thinking
    });
  };

  // Initialize chat with a greeting from the AI
  useEffect(() => {
    const initializeChat = async () => {
      const aiGreeting = await simulateAiResponse('', assignment);
      setMessages([{ sender: 'ai', text: aiGreeting }]);
    };
    
    initializeChat();
  }, [assignment]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = input.trim();
    setMessages([...messages, { sender: 'user', text: userMessage }]);
    setInput('');
    
    // Get AI response
    const aiResponse = await simulateAiResponse(userMessage, assignment);
    setMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'ai', text: aiResponse }
    ]);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>AI Tutor Chat</h3>
      </div>
      
      <div className="chat-messages">
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