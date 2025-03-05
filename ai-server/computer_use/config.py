"""
Computer Use Configuration

This module defines the configuration options for the Computer Use Agent.
"""

import os
from typing import Optional
from pydantic import BaseModel

class ComputerUseConfig(BaseModel):
    """Configuration for the Computer Use Agent."""
    
    # Provider settings
    provider: str = "openai"  # "openai" or "deepseek"
    
    # OpenAI settings
    openai_api_key: Optional[str] = None
    
    # DeepSeek settings
    deepseek_api_key: Optional[str] = None
    deepseek_endpoint: Optional[str] = None
    
    # For future DeepSeek integration
    # When DeepSeek's API is fully operational, enable these settings:
    # - deepseek_model: Optional[str] = "deepseek-coder-6.7b-instruct"
    # - deepseek_max_tokens: int = 4096
    # - deepseek_temperature: float = 0.0
    # - deepseek_top_p: float = 0.95
    
    # Browser settings
    headless: bool = False
    viewport_width: int = 1280
    viewport_height: int = 800
    
    # Agent settings
    use_vision: bool = True
    max_steps: int = 20
    
    def __init__(self, **data):
        """Initialize with environment variables as fallbacks."""
        # Set API keys from environment if not provided
        if 'openai_api_key' not in data or not data['openai_api_key']:
            data['openai_api_key'] = os.environ.get('VITE_OPENAI_API_KEY')
            
        if 'deepseek_api_key' not in data or not data['deepseek_api_key']:
            data['deepseek_api_key'] = os.environ.get('VITE_DEEPSEEK_API_KEY')
            
        if 'deepseek_endpoint' not in data or not data['deepseek_endpoint']:
            data['deepseek_endpoint'] = os.environ.get('VITE_AI_ENDPOINT')
        
        super().__init__(**data)

    def get_active_api_key(self) -> Optional[str]:
        """Get the API key for the currently selected provider."""
        if self.provider == "openai":
            return self.openai_api_key
        elif self.provider == "deepseek":
            return self.deepseek_api_key
        return None 