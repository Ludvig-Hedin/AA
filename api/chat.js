import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, api_key, conversation_history = [] } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (!api_key) {
    return res.status(400).json({ error: 'API key is required' });
  }

  try {
    const configuration = new Configuration({
      apiKey: api_key,
    });
    
    const openai = new OpenAIApi(configuration);
    
    // Build the system context
    const systemPrompt = `You are an intelligent assistant that can help with various tasks. 
You have the ability to perform tasks in a browser when explicitly requested by saying "I can help with that using the browser".
Some examples of tasks you can perform in a browser include:
- Searching for information
- Navigating to websites
- Filling out forms
- Taking screenshots
- Reading data from web pages

When the user wants you to perform a task in a browser, suggest using the browser functionality.
For regular questions, provide helpful and accurate answers.`;

    // Prepare conversation history
    let messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Add conversation history if provided
    if (conversation_history && conversation_history.length > 0) {
      // Filter out system messages from history as we want to use our own
      const filteredHistory = conversation_history.filter(msg => msg.role !== 'system');
      messages = [...messages, ...filteredHistory];
    }
    
    // Add the current user message
    messages.push({ role: 'user', content: message });
    
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    // Get the AI's response
    const aiResponse = response.data.choices[0].message.content;
    
    // Check if the response suggests using the browser
    const suggestsBrowser = aiResponse.toLowerCase().includes('browser') && 
      (aiResponse.toLowerCase().includes('i can help') || 
       aiResponse.toLowerCase().includes('would you like me to'));
    
    return res.status(200).json({
      message: aiResponse,
      suggests_browser: suggestsBrowser
    });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to communicate with AI service',
      detail: error.response?.data || error.message
    });
  }
} 