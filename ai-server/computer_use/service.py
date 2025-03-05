"""
Computer Use Agent Service

This module provides a wrapper around the browser-use library to enable
AI-controlled computer usage within our application.
"""

import os
import asyncio
from typing import Dict, Any, Optional, List
import logging

from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel
from langchain.schema import HumanMessage

# Import browser-use components
from browser_use import Agent, Browser, BrowserConfig, Controller
from .config import ComputerUseConfig

logger = logging.getLogger(__name__)

class ComputerUseAgent:
    """
    Agent for computer use capabilities powered by browser-use.
    """
    
    def __init__(self, config: Optional[ComputerUseConfig] = None):
        """
        Initialize the ComputerUseAgent.
        
        Args:
            config: Configuration for the agent. If None, will use default values.
        """
        self.config = config or ComputerUseConfig()
        self.llm = self._initialize_llm()
        self.controller = Controller()
        self.browser = Browser(
            config=BrowserConfig(
                headless=self.config.headless,
                viewport_width=self.config.viewport_width,
                viewport_height=self.config.viewport_height,
            )
        )
        self.agent = None
        self._paused = False
        
    def _initialize_llm(self) -> BaseChatModel:
        """
        Initialize the language model based on the configured provider.
        
        Returns:
            An instance of a language model.
        """
        if self.config.provider == "openai":
            api_key = self.config.openai_api_key
            if not api_key:
                api_key = os.environ.get("VITE_OPENAI_API_KEY")
                
            if not api_key:
                raise ValueError("OpenAI API key not found. Please set it in the config or VITE_OPENAI_API_KEY environment variable.")
                
            return ChatOpenAI(
                model="gpt-4o",
                openai_api_key=api_key,
                temperature=0.0
            )
        elif self.config.provider == "deepseek":
            # DeepSeek integration
            api_key = self.config.deepseek_api_key
            endpoint = self.config.deepseek_endpoint
            
            if not api_key:
                api_key = os.environ.get("VITE_DEEPSEEK_API_KEY")
                
            if not endpoint:
                endpoint = os.environ.get("VITE_AI_ENDPOINT")
                
            if not api_key or not endpoint:
                raise ValueError("DeepSeek API key or endpoint not found. Please set them in the config or environment variables.")
                
            # Placeholder for DeepSeek integration
            # In the future, we'll implement a proper DeepSeek LLM adapter
            try:
                from langchain.chat_models.base import BaseChatModel
                
                class DeepSeekChatModel(BaseChatModel):
                    """Custom LangChain model for DeepSeek integration."""
                    
                    def __init__(self, api_key: str, endpoint: str):
                        super().__init__()
                        self.api_key = api_key
                        self.endpoint = endpoint
                    
                    def _generate(self, messages, stop=None, **kwargs):
                        raise NotImplementedError("DeepSeek integration is still under development")
                    
                    async def _agenerate(self, messages, stop=None, **kwargs):
                        raise NotImplementedError("DeepSeek integration is still under development")
                
                return DeepSeekChatModel(api_key=api_key, endpoint=endpoint)
            except Exception as e:
                logger.error(f"Failed to initialize DeepSeek model: {e}")
                raise ValueError(f"DeepSeek integration is not yet fully implemented: {e}")
        
        raise ValueError(f"Unsupported provider: {self.config.provider}")
    
    async def create_agent(self, task: str) -> Agent:
        """
        Create a browser-use agent for the specified task.
        
        Args:
            task: The task description for the agent to perform.
            
        Returns:
            A configured Agent instance.
        """
        self.agent = Agent(
            task=task,
            llm=self.llm,
            controller=self.controller,
            browser=self.browser,
            use_vision=self.config.use_vision,
            max_actions_per_step=1,
        )
        return self.agent
    
    async def run(self, task: str) -> Dict[str, Any]:
        """
        Run the agent to perform the specified task.
        
        Args:
            task: The task description for the agent to perform.
            
        Returns:
            Results from the agent's execution.
        """
        if not self.agent or self.agent.task != task:
            self.agent = await self.create_agent(task)
        
        try:
            result = await self.agent.run(max_steps=self.config.max_steps)
            return {
                "success": True,
                "result": result,
                "history": self.agent.history,
            }
        except Exception as e:
            logger.error(f"Error running agent: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "history": self.agent.history if self.agent else []
            }
    
    async def pause(self) -> bool:
        """
        Pause the current agent execution.
        
        Returns:
            True if the agent was paused, False otherwise.
        """
        if not self.agent:
            return False
            
        self._paused = True
        # Signal the agent to pause
        if hasattr(self.agent, "pause") and callable(getattr(self.agent, "pause")):
            await self.agent.pause()
        return True
        
    async def resume(self) -> bool:
        """
        Resume the current agent execution.
        
        Returns:
            True if the agent was resumed, False otherwise.
        """
        if not self.agent:
            return False
            
        self._paused = False
        # Signal the agent to resume
        if hasattr(self.agent, "resume") and callable(getattr(self.agent, "resume")):
            await self.agent.resume()
        return True
        
    async def stop(self) -> bool:
        """
        Stop the current agent execution.
        
        Returns:
            True if the agent was stopped, False otherwise.
        """
        if not self.agent:
            return False
            
        # Signal the agent to stop
        if hasattr(self.agent, "stop") and callable(getattr(self.agent, "stop")):
            await self.agent.stop()
        return True
    
    async def add_user_message(self, message: str) -> bool:
        """
        Add a user message to the agent's context.
        
        Args:
            message: The message from the user.
            
        Returns:
            True if the message was added successfully, False otherwise.
        """
        if not self.agent:
            return False
            
        try:
            # Add the message to the agent's chat history
            if hasattr(self.agent, "add_user_input") and callable(getattr(self.agent, "add_user_input")):
                await self.agent.add_user_input(message)
            else:
                # Alternative approach if add_user_input doesn't exist
                if hasattr(self.llm, "add_message"):
                    self.llm.add_message(HumanMessage(content=message))
                
                # Also add it to the agent's reasoning so it's visible in responses
                if hasattr(self.agent, "reasoning"):
                    current_reasoning = getattr(self.agent, "reasoning", "")
                    new_reasoning = f"{current_reasoning}\nUser message: {message}"
                    setattr(self.agent, "reasoning", new_reasoning)
            
            return True
        except Exception as e:
            logger.error(f"Error adding user message: {e}", exc_info=True)
            return False
    
    async def close(self):
        """Close the browser and release resources."""
        if self.browser:
            await self.browser.close() 