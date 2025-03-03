#!/bin/bash

echo "Stopping any running Vite servers..."
pkill -f "node.*vite" || true

echo "Checking .env file..."
if [ -f .env ]; then
  echo "✅ .env file found"
else
  echo "⚠️ .env file not found. Creating template..."
  cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
  echo "⚠️ Please edit the .env file with your actual Supabase credentials"
  exit 1
fi

echo "Starting development server..."
npm run dev 