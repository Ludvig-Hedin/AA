# AI Assistant with Browser Control

This application allows you to interact with an AI assistant that can control your browser to perform tasks for you. It integrates chat-based communication with AI-powered browser automation.

## Features

- **AI Chat Interface**: Communicate with an intelligent assistant using natural language
- **Browser Automation**: Let the AI control your browser to perform web-based tasks
- **Task Management**: Start, pause, resume, and stop browser automation tasks
- **Secure API Key Handling**: Your API keys are stored securely
- **Real-Time Status Updates**: Monitor browser tasks in real-time

## Prerequisites

- Node.js 16 or later
- Python 3.10 or later
- A modern web browser (Chrome, Firefox, Edge)
- OpenAI API key

## Setup Instructions

### Frontend Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```
   # AI Server Configuration
   AI_SERVER_URL=http://localhost:8000

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### AI Server Setup

1. Navigate to the AI server directory:
   ```bash
   cd ai-server
   ```

2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. Start the AI server:
   ```bash
   ./start.sh
   ```

## Using the Application

1. Open your browser and navigate to the development server URL (typically http://localhost:3000)
2. Go to the "Computer Use" page
3. Enter a task you want the AI to perform in the browser, for example:
   - "Search for the latest news about artificial intelligence"
   - "Find the cheapest flight from New York to London next month"
   - "Look up the weather forecast for Stockholm this weekend"
4. The AI will control the browser to accomplish the task
5. You can provide additional instructions through the chat interface as the task progresses

## Browser Control Commands

While a browser task is in progress, you can use these commands:

- "pause" - Pause the current browser task
- "resume" - Resume a paused task
- "stop" - Stop the current task
- "take a screenshot" - Capture the current browser state
- "scroll down/up" - Navigate on the current page

## Security Considerations

- The application uses your OpenAI API key to power the AI functionality
- API keys are stored securely in environment variables
- The AI can only control your browser within the scope of the application
- All browser activities can be monitored and controlled by you

## Troubleshooting

- If the AI server fails to start, check that Python 3.10+ is installed
- If browser control isn't working, ensure Playwright browsers are installed correctly
- For API connection issues, verify your OpenAI API key is valid

## Advanced Configuration

To use DeepSeek instead of OpenAI (when available):

1. Obtain a DeepSeek API key
2. Add to your `.env.local` file:
   ```
   VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
   VITE_AI_ENDPOINT=your_deepseek_endpoint
   ```
3. Update the configuration in the browser task to use the DeepSeek provider

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

