"""
AI Server - Main Application

This is the entry point for the AI server that provides computer use capabilities
using browser-use and OpenAI.
"""

import os
import logging
from typing import Dict, Any, Optional, List
from uuid import uuid4
import asyncio
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from computer_use.service import ComputerUseAgent
from computer_use.config import ComputerUseConfig

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="AI Server", description="AI server with computer use capabilities")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active tasks
active_tasks: Dict[str, Dict[str, Any]] = {}

# Models
class TaskConfig(BaseModel):
    provider: str = "openai"
    openai_api_key: Optional[str] = None
    deepseek_api_key: Optional[str] = None
    deepseek_endpoint: Optional[str] = None
    headless: bool = False
    use_vision: bool = True
    max_steps: int = 20
    
class TaskRequest(BaseModel):
    task: str
    config: Optional[TaskConfig] = None
    
class MessageRequest(BaseModel):
    message: str

# Routes
@app.get("/")
async def root():
    return {"status": "online", "message": "AI Server is running"}

@app.post("/computer-use/tasks")
async def create_task(request: TaskRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid4())
    
    # Create configuration
    config = ComputerUseConfig(
        provider=request.config.provider if request.config else "openai",
        openai_api_key=request.config.openai_api_key if request.config else None,
        deepseek_api_key=request.config.deepseek_api_key if request.config else None,
        deepseek_endpoint=request.config.deepseek_endpoint if request.config else None,
        headless=request.config.headless if request.config else False,
        use_vision=request.config.use_vision if request.config else True,
        max_steps=request.config.max_steps if request.config else 20,
    )
    
    # Create agent
    agent = ComputerUseAgent(config=config)
    
    # Store task information
    active_tasks[task_id] = {
        "id": task_id,
        "task": request.task,
        "status": "pending",
        "created_at": datetime.now().isoformat(),
        "agent": agent,
        "history": [],
        "current_url": None,
        "reasoning": None,
        "messages": [],
    }
    
    # Run task in background
    background_tasks.add_task(run_task, task_id, request.task, agent)
    
    return {
        "task_id": task_id,
        "status": "pending",
        "message": "Task created and starting execution",
    }

@app.get("/computer-use/tasks/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    task_info = active_tasks[task_id]
    
    # Exclude agent from response
    response = {k: v for k, v in task_info.items() if k != "agent"}
    
    return response

@app.post("/computer-use/tasks/{task_id}/message")
async def send_message_to_task(task_id: str, request: MessageRequest):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    task_info = active_tasks[task_id]
    agent = task_info.get("agent")
    
    if not agent:
        raise HTTPException(status_code=400, detail="Agent not available")
    
    # Store the message
    active_tasks[task_id]["messages"].append({
        "content": request.message,
        "timestamp": datetime.now().isoformat(),
    })
    
    # Add message to agent's history
    if hasattr(agent, "add_user_message") and callable(agent.add_user_message):
        await agent.add_user_message(request.message)
    
    return {"status": "success", "message": "Message received by agent"}

@app.post("/computer-use/tasks/{task_id}/pause")
async def pause_task(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    task_info = active_tasks[task_id]
    agent = task_info.get("agent")
    
    if not agent:
        raise HTTPException(status_code=400, detail="Agent not available")
    
    # Pause the agent
    if hasattr(agent, "pause") and callable(agent.pause):
        await agent.pause()
        active_tasks[task_id]["status"] = "paused"
    
    return {"status": "success", "message": "Task paused"}

@app.post("/computer-use/tasks/{task_id}/resume")
async def resume_task(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    task_info = active_tasks[task_id]
    agent = task_info.get("agent")
    
    if not agent:
        raise HTTPException(status_code=400, detail="Agent not available")
    
    # Resume the agent
    if hasattr(agent, "resume") and callable(agent.resume):
        await agent.resume()
        active_tasks[task_id]["status"] = "running"
    
    return {"status": "success", "message": "Task resumed"}

@app.post("/computer-use/tasks/{task_id}/stop")
async def stop_task(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    task_info = active_tasks[task_id]
    agent = task_info.get("agent")
    
    if not agent:
        raise HTTPException(status_code=400, detail="Agent not available")
    
    # Stop the agent
    if hasattr(agent, "stop") and callable(agent.stop):
        await agent.stop()
    
    # Clean up resources
    if hasattr(agent, "close") and callable(agent.close):
        await agent.close()
    
    active_tasks[task_id]["status"] = "stopped"
    
    return {"status": "success", "message": "Task stopped"}

@app.get("/computer-use/tasks")
async def list_tasks():
    # Exclude agent from response
    tasks = []
    for task_id, task_info in active_tasks.items():
        tasks.append({k: v for k, v in task_info.items() if k != "agent"})
    
    return tasks

# Background task function
async def run_task(task_id: str, task_description: str, agent: ComputerUseAgent):
    try:
        # Update status to running
        active_tasks[task_id]["status"] = "running"
        
        # Create and run the agent
        result = await agent.run(task_description)
        
        # Update task info with results
        active_tasks[task_id]["history"] = agent.agent.history if agent.agent else []
        active_tasks[task_id]["status"] = "completed" if result.get("success", False) else "failed"
        
        # Extract current URL and reasoning if available
        if agent.agent:
            if hasattr(agent.agent, "browser") and agent.agent.browser:
                current_url = await agent.agent.browser.current_url()
                active_tasks[task_id]["current_url"] = current_url
            
            if hasattr(agent.agent, "reasoning") and agent.agent.reasoning:
                active_tasks[task_id]["reasoning"] = agent.agent.reasoning
    except Exception as e:
        logger.error(f"Error running task {task_id}: {e}", exc_info=True)
        active_tasks[task_id]["status"] = "failed"
        active_tasks[task_id]["error"] = str(e)
    finally:
        # Always close the agent when done
        if agent:
            try:
                await agent.close()
            except Exception as e:
                logger.error(f"Error closing agent for task {task_id}: {e}", exc_info=True)

# Main entry point for running the server directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 