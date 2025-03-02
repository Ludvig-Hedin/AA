#!/bin/bash

# Build script for AI Assistant Web App

echo "Building AI Assistant Web App..."

# Build the web app
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

echo "Web build completed successfully."

# Copy web assets to Capacitor
npx cap copy

echo "Syncing Capacitor plugins..."
npx cap sync

echo "Build process completed successfully!"
echo "To open in Xcode: npx cap open ios"
echo "To open in Android Studio: npx cap open android" 