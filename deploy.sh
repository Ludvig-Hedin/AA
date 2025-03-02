#!/bin/bash

# Simple script to deploy to Vercel

echo "Deploying to Vercel..."

# Check if Vercel CLI is installed locally
if [ ! -f "./node_modules/.bin/vercel" ]; then
    echo "Vercel CLI is not installed locally. Installing..."
    npm install --save-dev vercel
fi

# Deploy to Vercel using the local installation with automatic confirmation
echo "Running Vercel deployment..."
echo "y" | npx vercel --prod --yes

echo "Deployment complete! Check your Vercel dashboard for details."
