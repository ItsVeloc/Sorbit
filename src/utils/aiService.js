// src/utils/aiService.js
import axios from 'axios';

// API configuration - in production, move to environment variables
const API_CONFIG = {
  // Default to OpenAI, but can be changed to other providers
  provider: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  
  // Rate limiting settings
  maxRequestsPerMinute: 10,
  requestTracker: [],
  cooldownPeriod: 60000, // 1 minute
  
  // Error messages
  errorMessages: {
    rateLimited: "I need a moment to think. Let's continue in a bit.",
    serverError: "I'm having trouble connecting to my knowledge base. Please try again.",
    networkError: "Having trouble connecting. Please check your internet and try again.",
    generic: "I encountered an issue processing your question. Let's try a different approach."
  }
};

// Check if we've hit rate limits
const isRateLimited = () => {
  const now = Date.now();
  // Clean up old requests
  API_CONFIG.requestTracker = API_CONFIG.requestTracker.filter(
    timestamp => now - timestamp < API_CONFIG.cooldownPeriod
  );
  // Check if we're over the limit
  return API_CONFIG.requestTracker.length >= API_CONFIG.maxRequestsPerMinute;
};

// Track a new request
const trackRequest = () => {
  API_CONFIG.requestTracker.push(Date.now());
};

// Create a system prompt based on assignment content
const createSystemPrompt = (assignment) => {
  const questionsSection = assignment.questions && assignment.questions.length > 0
    ? `
Sample questions and answers for this topic:
${assignment.questions.map(q => `Question: ${q.question}
Answer: ${q.answer}`).join('\n\n')}
    `
    : '';

  return `You are an AI tutor helping a student with their homework assignment.

Assignment Title: ${assignment.title}
Subject: ${assignment.subject}
Description: ${assignment.description}

${questionsSection}

Your role is to help the student understand the topic, not just provide answers. Follow these guidelines:

1. Ask questions to assess the student's current understanding
2. Explain concepts clearly using age-appropriate language
3. If the student gives an incorrect answer, don't just tell them the right answer - guide them to discover it
4. Use the Socratic method - ask leading questions when students are stuck
5. Provide positive reinforcement when students demonstrate understanding
6. Break down complex topics into simpler components
7. Use real-world examples and analogies when helpful
8. If the student is confused, try explaining the concept in a different way
9. Keep responses concise (3-5 sentences) unless a detailed explanation is needed

Your goal is to help the student truly understand the material, not just complete the assignment.`;
};

// Call OpenAI API
export const generateAiResponse = async (prompt, assignment, chatHistory = []) => {
  // If we're rate limited, return a message immediately
  if (isRateLimited()) {
    console.log('Rate limit reached, using fallback');
    return API_CONFIG.errorMessages.rateLimited;
  }
  
  try {
    // Track this request
    trackRequest();
    
    // Format messages for the API
    const messages = [
      { role: 'system', content: createSystemPrompt(assignment) },
      // Only include the last 6 messages to keep within token limits
      ...chatHistory.slice(-6).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];
    
    // Add the current prompt if not empty
    if (prompt) {
      messages.push({ role: 'user', content: prompt });
    }

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: API_CONFIG.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM API:', error);
    
    // Handle different error types
    const status = error.response?.status;
    if (status === 429) {
      return API_CONFIG.errorMessages.rateLimited;
    } else if (status >= 500) {
      return API_CONFIG.errorMessages.serverError;
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return API_CONFIG.errorMessages.networkError;
    }
    
    // Fall back to simulation if API call fails
    return generateSimulatedResponse(prompt, assignment);
  }
};

// Fallback simulation for when API is unavailable
export const generateSimulatedResponse = (prompt, assignment) => {
  console.log('Using simulated response fallback');
  
  if (!prompt) {
    return `Hello! I'm your AI tutor for "${assignment.title}". How can I help you understand this topic?`;
  }
  
  const promptLower = prompt.toLowerCase();
  
  // Simple keyword matching for fallback responses
  if (promptLower.includes('hello') || promptLower.includes('hi')) {
    return `Hello! I'm your AI tutor for "${assignment.title}". What questions do you have about ${assignment.subject}?`;
  }
  
  if (promptLower.includes('explain') || promptLower.includes('what is')) {
    return `${assignment.description} What specific part would you like me to explain in more detail?`;
  }
  
  if (promptLower.includes('example') || promptLower.includes('show me')) {
    if (assignment.questions && assignment.questions.length > 0) {
      const question = assignment.questions[Math.floor(Math.random() * assignment.questions.length)];
      return `Here's an example: ${question.question}`;
    }
    return `I'd be happy to provide an example. Could you be more specific about what you'd like me to demonstrate?`;
  }
  
  if (promptLower.includes('question') || promptLower.includes('quiz')) {
    if (assignment.questions && assignment.questions.length > 0) {
      const question = assignment.questions[Math.floor(Math.random() * assignment.questions.length)];
      return `Let's test your understanding: ${question.question}`;
    }
    return `I'd be happy to quiz you. What specific aspect of ${assignment.title} should I focus on?`;
  }
  
  if (promptLower.includes('help') || promptLower.includes('stuck')) {
    return `I understand this can be challenging. Let's break it down step by step. Which part of ${assignment.title} are you finding most difficult?`;
  }
  
  // Default response
  return `Let's continue exploring ${assignment.title}. What aspects of ${assignment.subject} would you like to understand better?`;
};