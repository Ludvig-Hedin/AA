import axios from 'axios';

export const sendMessageToAI = async (message: string) => {
  try {
    const response = await axios.post('/api/chat', {
      message,
      api_key: import.meta.env.VITE_OPENAI_API_KEY,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
}; 