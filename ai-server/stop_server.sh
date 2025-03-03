#!/bin/bash

if [ -f server.pid ]; then
    PID=$(cat server.pid)
    echo "Stopping server with PID: $PID"
    kill $PID
    rm server.pid
    echo "Server stopped."
else
    echo "No server PID file found. Server may not be running."
fi 