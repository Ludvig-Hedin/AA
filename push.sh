#!/bin/bash

# Script to push changes to GitHub

echo "Pushing changes to GitHub..."

# Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit."
  exit 0
fi

# Add all changes
git add .

# Prompt for commit message
echo "Enter commit message:"
read commit_message

# If no message is provided, use a default one
if [ -z "$commit_message" ]; then
  commit_message="Update project files"
fi

# Commit changes
git commit -m "$commit_message"

# Push to GitHub
git push

echo "Changes pushed to GitHub successfully!" 