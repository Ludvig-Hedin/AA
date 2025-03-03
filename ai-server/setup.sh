#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install

# Clone DeepSeek repositories if needed
if [ ! -d "deepseek" ]; then
  mkdir -p deepseek
  
  # Clone DeepSeek repositories
  echo "Cloning DeepSeek repositories..."
  git clone https://github.com/deepseek-ai/DeepSeek-R1.git deepseek/DeepSeek-R1
  git clone https://github.com/deepseek-ai/DeepSeek-V3.git deepseek/DeepSeek-V3
  
  echo "DeepSeek repositories cloned successfully."
else
  echo "DeepSeek directory already exists, skipping clone."
fi

echo "Setup completed successfully!" 