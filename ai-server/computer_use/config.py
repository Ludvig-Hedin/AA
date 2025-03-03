from pydantic import BaseModel, Field
from typing import Optional, Literal


class ComputerUseConfig(BaseModel):
    """Configuration for the Computer Use agent."""
    
    # AI model configuration
    provider: Literal["openai", "deepseek"] = Field(default="openai", description="AI provider to use")
    openai_api_key: Optional[str] = Field(default=None, description="OpenAI API key")
    deepseek_api_key: Optional[str] = Field(default=None, description="DeepSeek API key")
    deepseek_endpoint: Optional[str] = Field(default=None, description="DeepSeek endpoint URL")
    
    # Browser configuration
    headless: bool = Field(default=False, description="Run browser in headless mode")
    viewport_width: int = Field(default=1280, description="Browser viewport width")
    viewport_height: int = Field(default=800, description="Browser viewport height")
    
    # Agent configuration
    max_steps: int = Field(default=20, description="Maximum number of steps for the agent to take")
    use_vision: bool = Field(default=True, description="Whether to use vision capabilities")
    debug_mode: bool = Field(default=False, description="Enable debug mode for verbose output")
    
    def get_active_api_key(self) -> Optional[str]:
        """Get the API key for the currently selected provider."""
        if self.provider == "openai":
            return self.openai_api_key
        elif self.provider == "deepseek":
            return self.deepseek_api_key
        return None 