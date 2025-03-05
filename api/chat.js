import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, api_key } = req.body;
  
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
    
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that can control the user\'s browser to accomplish tasks.' },
        { role: 'user', content: message }
      ],
    });
    
    return res.status(200).json({
      message: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return res.status(500).json({ error: 'Failed to communicate with AI service' });
  }
} 