import axios from 'axios';

// Define the AI server URL based on environment
const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }
  
  try {
    const response = await axios.get(`${AI_SERVER_URL}/computer-use/tasks/${id}`);
    
    return res.status(200).json({
      status: response.data.status,
      message: response.data.message || 'Task status retrieved',
      data: response.data
    });
  } catch (error) {
    console.error('Error getting task status:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to get task status',
      detail: error.response?.data || error.message
    });
  }
} 