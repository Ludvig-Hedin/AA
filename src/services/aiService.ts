import axios from 'axios';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToAI = async (message: string, conversationHistory: Message[] = []) => {
  try {
    const response = await axios.post('/api/chat', {
      message,
      api_key: import.meta.env.VITE_OPENAI_API_KEY,
      conversation_history: conversationHistory
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
}; 