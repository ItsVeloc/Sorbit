// tests/unit/services/aiService.test.js
const AiService = require('../../../src/services/AiService');
const Assignment = require('../../../src/models/Assignment');
const ChatMessage = require('../../../src/models/ChatMessage');

// Mock dependencies
jest.mock('../../../src/models/Assignment');
// tests/unit/services/aiService.test.js (update the mocking)

// Create better mocks that don't trigger validation
jest.mock('../../../src/models/ChatMessage', () => {
  return {
    create: jest.fn().mockImplementation((data) => {
      return Promise.resolve({
        _id: 'mock-message-id',
        ...data
      });
    }),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([
        { role: 'user', content: 'What is a linear equation?' }
      ])
    })
  };
});

jest.mock('../../../src/models/Assignment', () => {
  return {
    findById: jest.fn()
  };
});

describe('AI Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup the mocks
    Assignment.findById = jest.fn().mockImplementation((id) => {
      if (id === 'mock-assignment-id') {
        return Promise.resolve({
          title: 'Linear Equations',
          subject: 'Mathematics',
          description: 'Learn to solve linear equations.',
          questions: [
            { question: 'What is a linear equation?', answer: 'An equation with variables of degree 1' }
          ]
        });
      } else if (id === 'essay-assignment-id') {
        return Promise.resolve({
          title: 'Essay Writing',
          subject: 'English',
          description: 'Learn to write persuasive essays.',
          questions: []
        });
      }
      return Promise.resolve(null);
    });
    
    ChatMessage.create = jest.fn().mockImplementation((data) => {
      return Promise.resolve({
        _id: 'mock-message-id',
        ...data
      });
    });
    
    ChatMessage.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([
            { role: 'user', content: 'What is a linear equation?' }
          ])
        })
      })
    });
  });
  
  describe('generateSystemPrompt', () => {
    it('should generate a system prompt with assignment information', async () => {
      const prompt = await AiService.generateSystemPrompt('mock-assignment-id');
      
      expect(prompt).toContain('Linear Equations');
      expect(prompt).toContain('Mathematics');
      expect(prompt).toContain('What is a linear equation?');
    });
    
    it('should handle assignments with no sample questions', async () => {
      const prompt = await AiService.generateSystemPrompt('essay-assignment-id');
      
      expect(prompt).toContain('Essay Writing');
      expect(prompt).toContain('English');
      expect(prompt).not.toContain('Sample questions');
    });
  });
  
  describe('sendMessage', () => {
    it('should process user message and return AI response', async () => {
      const result = await AiService.sendMessage(
        'user-id',
        'assignment-id',
        'What is a linear equation?'
      );
      
      // Verify user message was saved
      expect(ChatMessage.create).toHaveBeenCalledWith(expect.objectContaining({
        assignment: 'assignment-id',
        user: 'user-id',
        content: 'What is a linear equation?',
        role: 'user'
      }));
      
      // Verify AI response was generated and saved
      expect(ChatMessage.create).toHaveBeenCalledWith(expect.objectContaining({
        role: 'assistant'
      }));
      
      // Check return value
      expect(result).toHaveProperty('messageId');
      expect(result).toHaveProperty('content');
    });
  });
});