import axios from 'axios';

export const startBrowserTask = async (task: string) => {
  try {
    const response = await axios.post('/api/computer-use', {
      task,
      openai_api_key: import.meta.env.VITE_OPENAI_API_KEY,
      headless: false
    });
    
    return response.data;
  } catch (error) {
    console.error('Error starting browser task:', error);
    throw error;
  }
};

export const getBrowserTaskStatus = async (taskId: string) => {
  try {
    const response = await axios.get(`/api/computer-use/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting task status:', error);
    throw error;
  }
};

export const sendMessageToBrowserTask = async (taskId: string, message: string) => {
  try {
    const response = await axios.post(`/api/computer-use/${taskId}/message`, {
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to task:', error);
    throw error;
  }
}; 