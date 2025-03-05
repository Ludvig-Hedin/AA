#!/bin/bash

# Make script exit if any command fails
set -e

echo "Setting up AI Server..."

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Error: Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d ' ' -f 2)
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d '.' -f 1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d '.' -f 2)

echo "Found Python version: $PYTHON_VERSION"

if [ $PYTHON_MAJOR -lt 3 ] || ([ $PYTHON_MAJOR -eq 3 ] && [ $PYTHON_MINOR -lt 10 ]); then
    echo "Error: Python 3.10 or higher is required."
    echo "Current version: $PYTHON_VERSION"
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Playwright browsers
echo "Installing Playwright browsers..."
python -m playwright install

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs

# Set executable permissions for start script
chmod +x start.sh

# Create empty .dependencies_installed file
touch .dependencies_installed

echo "Setup complete! You can now run ./start.sh to start the AI server." 