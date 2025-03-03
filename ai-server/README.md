# AI Server

This server provides AI functionality to the main application, including the Computer Use feature that allows AI to control the browser to perform tasks.

## Setup

### Prerequisites

- Python 3.10 or later
- Node.js 16 or later
- Git

### Installation

1. Make the setup script executable and run it:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install required Python packages
- Install Playwright browsers
- Clone the DeepSeek repositories (if using DeepSeek)

### Configuration

Set your API keys in the `.env` file in the root directory:

```
# For OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key_here

# For DeepSeek (when ready)
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_AI_ENDPOINT=your_deepseek_endpoint_here
```

## Starting the Server

Start the AI server by running:

```bash
./start.sh
```

The server will be available at `http://localhost:8000`.

## Using Computer Use Feature

1. Start the AI server using the instructions above
2. Open the main application and navigate to the Computer Use page
3. Enter your API key (or use the one configured in `.env`)
4. Specify the task you want the AI to perform
5. Submit the task and watch the AI control the browser to complete it

### Example Tasks

Here are some example tasks you can try:

- "Go to reddit.com and find the top posts in r/programming"
- "Search for 'best coding practices' on Google and summarize the first result"
- "Find the price of the latest iPhone on apple.com"

## Integrating DeepSeek

The DeepSeek integration is currently in development. Once completed, you will be able to:

1. Set up a DeepSeek server following their documentation
2. Configure the endpoint and API key in the `.env` file
3. Select DeepSeek as the provider in the Computer Use interface

## Troubleshooting

- **Browser not launching**: Ensure Playwright is installed correctly by running `python -m playwright install`
- **API errors**: Check that your API keys are set correctly in the `.env` file
- **Task execution issues**: Make sure the task is described clearly and specifically

## Advanced Configuration

For advanced configuration options, see the `config.py` file in the `computer_use` directory. 