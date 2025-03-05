#!/bin/bash

# Make script exit if any command fails
set -e

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f ".dependencies_installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    
    # Install Playwright browsers
    echo "Installing Playwright browsers..."
    python -m playwright install
    
    # Mark dependencies as installed
    touch .dependencies_installed
fi

# Set environment variables from .env file if it exists
if [ -f "../.env" ]; then
    echo "Loading environment variables from ../.env"
    export $(grep -v '^#' ../.env | xargs)
fi

# Start the server with uvicorn
echo "Starting AI server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload 