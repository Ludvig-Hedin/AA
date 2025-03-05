import axios from 'axios';

// Define the AI server URL based on environment
const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';

export default async function handler(req, res) {
  // Handle different HTTP methods
  if (req.method === 'POST') {
    return await startTask(req, res);
  }
  
  if (req.method === 'GET') {
    return await getTaskStatus(req, res);
  }
  
  // Method not allowed for other HTTP methods
  return res.status(405).json({ error: 'Method not allowed' });
}

// Start a new browser task
async function startTask(req, res) {
  const { task, openai_api_key, headless = false } = req.body;
  
  if (!task) {
    return res.status(400).json({ error: 'Task description is required' });
  }
  
  if (!openai_api_key) {
    return res.status(400).json({ error: 'OpenAI API key is required' });
  }
  
  try {
    const response = await axios.post(`${AI_SERVER_URL}/computer-use/tasks`, {
      task,
      config: {
        provider: 'openai',
        openai_api_key: openai_api_key,
        headless: headless
      }
    });
    
    return res.status(200).json({
      status: 'started',
      message: 'Task started successfully',
      task_id: response.data.task_id,
      data: response.data
    });
  } catch (error) {
    console.error('Error starting task:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to start task',
      detail: error.response?.data || error.message
    });
  }
}

// Get the status of a running task
async function getTaskStatus(req, res) {
  // Extract task ID from the URL
  const taskId = req.query.id;
  
  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required' });
  }
  
  try {
    const response = await axios.get(`${AI_SERVER_URL}/computer-use/tasks/${taskId}`);
    
    return res.status(200).json({
      status: response.data.status,
      message: response.data.message || 'Task is running',
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