#!/bin/bash

# Set environment variables from the root .env file
export $(grep -v '^#' ../.env | xargs)

# Create log directory
mkdir -p logs

# Start the server in detached mode with nohup
echo "Starting AI Server in detached mode..."
nohup python -m uvicorn api:app --host 0.0.0.0 --port 8000 > logs/server.log 2>&1 &

# Save the process ID
PID=$!
echo $PID > server.pid
echo "Server started with PID: $PID"
echo "The server will continue running in the background."
echo "Server logs are available in logs/server.log"
echo "To stop the server, run: ./stop_server.sh" 