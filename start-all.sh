#!/bin/bash

# Make script exit if any command fails
set -e

echo "Starting the AI Assistant with Browser Control..."

# Check if screen is installed
if ! command -v screen &> /dev/null
then
    echo "The 'screen' utility is required but not installed."
    echo "Please install it using your package manager:"
    echo "  - macOS: brew install screen"
    echo "  - Ubuntu/Debian: sudo apt-get install screen"
    echo "  - CentOS/RHEL: sudo yum install screen"
    exit 1
fi

# Create screens for each service
echo "Starting AI server..."
screen -dmS ai-server bash -c "cd ai-server && chmod +x start.sh && ./start.sh; read"

echo "Starting frontend..."
screen -dmS frontend bash -c "npm run dev; read"

echo "Both services are starting up in separate screen sessions."
echo ""
echo "To view the AI server output:"
echo "  screen -r ai-server"
echo ""
echo "To view the frontend output:"
echo "  screen -r frontend"
echo ""
echo "To detach from a screen session, press Ctrl+A followed by D"
echo ""
echo "The application should be accessible at: http://localhost:3000" 