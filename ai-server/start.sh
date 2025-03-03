#!/bin/bash

# Set environment variables from the root .env file
export $(grep -v '^#' ../.env | xargs)

# Start the FastAPI server
echo "Starting AI Server..."
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload 