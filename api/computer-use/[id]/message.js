import axios from 'axios';

// Define the AI server URL based on environment
const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { id } = req.query;
  const { message } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    const response = await axios.post(`${AI_SERVER_URL}/computer-use/tasks/${id}/message`, {
      message
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Message sent to task',
      data: response.data
    });
  } catch (error) {
    console.error('Error sending message to task:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to send message to task',
      detail: error.response?.data || error.message
    });
  }
} 