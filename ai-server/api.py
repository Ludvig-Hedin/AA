"""
API endpoints for AI server functionality.
"""

import os
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from pydantic import BaseModel
import asyncio
import uvicorn
import logging
import json
from datetime import datetime

from ai_server.computer_use.config import ComputerUseConfig
from ai_server.computer_use.service import ComputerUseAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Server API")

# Store active agents to prevent garbage collection
active_agents = {}
# Store message queues for user-agent interaction
message_queues = {}
# Store task state
task_states = {}

class ComputerUseRequest(BaseModel):
    """Request model for computer use tasks."""
    task: str
    openai_api_key: str
    headless: bool = False

class UserMessage(BaseModel):
    """Message from the user to the agent."""
    message: str

class ComputerUseResponse(BaseModel):
    """Response model for computer use tasks."""
    status: str
    message: str
    task_id: str = None
    data: Dict[str, Any] = None

@app.post("/api/computer-use", response_model=ComputerUseResponse)
async def start_computer_use_task(request: ComputerUseRequest, background_tasks: BackgroundTasks):
    """
    Start a new computer use task using the specified configuration.
    
    Args:
        request: The request containing the task and configuration.
        background_tasks: FastAPI background tasks manager.
        
    Returns:
        A response with task status information.
    """
    try:
        task_id = f"task_{len(active_agents) + 1}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Create agent configuration
        config = ComputerUseConfig(
            provider="openai",
            openai_api_key=request.openai_api_key,
            headless=request.headless
        )
        
        # Initialize the agent
        agent = ComputerUseAgent(config=config)
        active_agents[task_id] = agent
        
        # Create message queue for this task
        message_queues[task_id] = asyncio.Queue()
        
        # Set initial task state
        task_states[task_id] = {
            "status": "pending",
            "currentUrl": None,
            "reasoning": None,
            "paused": False,
            "stopped": False,
            "browser_image": None,
            "last_update": datetime.now().isoformat()
        }
        
        # Run the agent in the background
        background_tasks.add_task(run_agent_task, task_id, agent, request.task)
        
        return ComputerUseResponse(
            status="started",
            message=f"Computer use task '{request.task}' started successfully",
            task_id=task_id
        )
    except Exception as e:
        logger.error(f"Error starting computer use task: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/computer-use/{task_id}", response_model=ComputerUseResponse)
async def get_computer_use_task(task_id: str):
    """
    Get the status of a running computer use task.
    
    Args:
        task_id: The ID of the task to query.
        
    Returns:
        A response with task status information.
    """
    if task_id not in active_agents:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    agent = active_agents[task_id]
    task_state = task_states.get(task_id, {})
    
    # Combine agent data with task state
    data = {
        "history": agent.agent.history if agent.agent else [],
        "currentUrl": task_state.get("currentUrl"),
        "reasoning": task_state.get("reasoning"),
        "paused": task_state.get("paused", False),
        "stopped": task_state.get("stopped", False),
        "last_update": task_state.get("last_update")
    }
    
    return ComputerUseResponse(
        status=task_state.get("status", "pending"),
        message=f"Task {task_id} information retrieved",
        task_id=task_id,
        data=data
    )

@app.post("/api/computer-use/{task_id}/message")
async def send_message_to_agent(task_id: str, message: UserMessage):
    """
    Send a message to a running agent.
    
    Args:
        task_id: The ID of the task.
        message: The message to send.
        
    Returns:
        A success message.
    """
    if task_id not in active_agents:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    if task_id not in message_queues:
        message_queues[task_id] = asyncio.Queue()
    
    await message_queues[task_id].put(message.message)
    
    # Update task state
    if task_id in task_states:
        task_states[task_id]["last_update"] = datetime.now().isoformat()
    
    return {"status": "success", "message": "Message sent to agent"}

@app.post("/api/computer-use/{task_id}/pause")
async def pause_task(task_id: str):
    """
    Pause a running task.
    
    Args:
        task_id: The ID of the task to pause.
        
    Returns:
        A success message.
    """
    if task_id not in active_agents:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    # Update task state
    if task_id in task_states:
        task_states[task_id]["paused"] = True
        task_states[task_id]["status"] = "paused"
        task_states[task_id]["last_update"] = datetime.now().isoformat()
    
    return {"status": "success", "message": "Task paused"}

@app.post("/api/computer-use/{task_id}/resume")
async def resume_task(task_id: str):
    """
    Resume a paused task.
    
    Args:
        task_id: The ID of the task to resume.
        
    Returns:
        A success message.
    """
    if task_id not in active_agents:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    # Update task state
    if task_id in task_states:
        task_states[task_id]["paused"] = False
        task_states[task_id]["status"] = "running"
        task_states[task_id]["last_update"] = datetime.now().isoformat()
    
    return {"status": "success", "message": "Task resumed"}

@app.post("/api/computer-use/{task_id}/stop")
async def stop_task(task_id: str):
    """
    Stop a running task.
    
    Args:
        task_id: The ID of the task to stop.
        
    Returns:
        A success message.
    """
    if task_id not in active_agents:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    # Update task state
    if task_id in task_states:
        task_states[task_id]["stopped"] = True
        task_states[task_id]["status"] = "stopped"
        task_states[task_id]["last_update"] = datetime.now().isoformat()
    
    # Close browser
    try:
        await active_agents[task_id].close()
    except Exception as e:
        logger.error(f"Error closing browser for task {task_id}: {e}", exc_info=True)
    
    return {"status": "success", "message": "Task stopped"}

@app.get("/api/computer-use/browser-view", response_class=HTMLResponse)
async def get_browser_view():
    """
    Display a live view of the browser.
    
    Returns:
        HTML page that will show the browser.
    """
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Browser View</title>
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            #browser-container { width: 100%; height: 100vh; overflow: hidden; }
            #browser-image { width: 100%; height: 100%; object-fit: contain; }
            #status { position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div id="browser-container">
            <img id="browser-image" src="/api/computer-use/browser-stream" alt="Browser view">
        </div>
        <div id="status">Connecting to browser...</div>
        
        <script>
            const statusEl = document.getElementById('status');
            const imageEl = document.getElementById('browser-image');
            
            // Reload image periodically to get updates
            setInterval(() => {
                imageEl.src = `/api/computer-use/browser-stream?t=${new Date().getTime()}`;
                statusEl.textContent = 'Browser view active';
            }, 1000);
            
            // Handle errors
            imageEl.onerror = () => {
                statusEl.textContent = 'Error connecting to browser';
            };
        </script>
    </body>
    </html>
    """
    return html_content

@app.get("/api/computer-use/browser-stream")
async def get_browser_stream():
    """
    Stream the browser screenshot.
    
    Returns:
        Browser screenshot image.
    """
    # Find the most recently updated task
    latest_task_id = None
    latest_time = None
    
    for task_id, state in task_states.items():
        if "last_update" in state:
            try:
                update_time = datetime.fromisoformat(state["last_update"])
                if latest_time is None or update_time > latest_time:
                    latest_time = update_time
                    latest_task_id = task_id
            except (ValueError, TypeError):
                pass
    
    if not latest_task_id or latest_task_id not in task_states:
        # Return a placeholder image
        placeholder = os.path.join(os.path.dirname(__file__), "placeholder.png")
        if os.path.exists(placeholder):
            with open(placeholder, "rb") as f:
                return StreamingResponse(f, media_type="image/png")
        else:
            raise HTTPException(status_code=404, detail="No active browser session")
    
    # If there's a browser image, return it
    browser_image = task_states[latest_task_id].get("browser_image")
    if browser_image:
        return StreamingResponse(browser_image, media_type="image/png")
    else:
        raise HTTPException(status_code=404, detail="No browser image available")

@app.websocket("/api/computer-use/{task_id}/ws")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    """
    WebSocket endpoint for real-time updates from the agent.
    
    Args:
        websocket: The WebSocket connection.
        task_id: The ID of the task to connect to.
    """
    if task_id not in active_agents:
        await websocket.close(code=4004, reason=f"Task {task_id} not found")
        return
    
    await websocket.accept()
    
    try:
        while True:
            if task_id in task_states:
                await websocket.send_json(task_states[task_id])
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        logger.info(f"WebSocket for task {task_id} disconnected")
    except Exception as e:
        logger.error(f"WebSocket error for task {task_id}: {e}", exc_info=True)
        await websocket.close(code=1011, reason=str(e))

async def run_agent_task(task_id: str, agent: ComputerUseAgent, task: str):
    """
    Run an agent task and clean up when complete.
    
    Args:
        task_id: The ID of the task.
        agent: The agent to run.
        task: The task description.
    """
    # Update task state
    if task_id in task_states:
        task_states[task_id]["status"] = "running"
        task_states[task_id]["last_update"] = datetime.now().isoformat()
    
    try:
        # Start the task
        result_future = asyncio.ensure_future(agent.run(task))
        
        # Set up periodic browser screenshot capture
        screenshot_task = asyncio.ensure_future(capture_browser_screenshots(task_id, agent))
        
        # Monitor for user messages and task state changes
        message_task = asyncio.ensure_future(process_user_messages(task_id, agent))
        
        # Wait for the task to complete or be stopped
        while not result_future.done():
            if task_id in task_states and task_states[task_id].get("stopped", False):
                result_future.cancel()
                break
            
            if task_id in task_states and task_states[task_id].get("paused", False):
                # We're paused, just wait
                await asyncio.sleep(1)
                continue
            
            # If the agent's state has reasoning, save it
            if agent.agent and hasattr(agent.agent, "chain") and hasattr(agent.agent.chain, "last_log"):
                if task_id in task_states:
                    task_states[task_id]["reasoning"] = agent.agent.chain.last_log
            
            # If the browser has a URL, save it
            if agent.browser and hasattr(agent.browser, "current_url"):
                if task_id in task_states:
                    task_states[task_id]["currentUrl"] = agent.browser.current_url
            
            await asyncio.sleep(0.5)
        
        # Clean up the monitoring tasks
        screenshot_task.cancel()
        message_task.cancel()
        
        # Update task state
        if task_id in task_states:
            task_states[task_id]["status"] = "completed"
            task_states[task_id]["last_update"] = datetime.now().isoformat()
        
        # Final cleanup
        try:
            await agent.close()
        except Exception as e:
            logger.error(f"Error closing agent for task {task_id}: {e}", exc_info=True)
    except asyncio.CancelledError:
        logger.info(f"Task {task_id} was cancelled")
        if task_id in task_states:
            task_states[task_id]["status"] = "cancelled"
            task_states[task_id]["last_update"] = datetime.now().isoformat()
    except Exception as e:
        logger.error(f"Error in agent task {task_id}: {e}", exc_info=True)
        if task_id in task_states:
            task_states[task_id]["status"] = "error"
            task_states[task_id]["error"] = str(e)
            task_states[task_id]["last_update"] = datetime.now().isoformat()
    finally:
        logger.info(f"Task {task_id} finished")

async def capture_browser_screenshots(task_id: str, agent: ComputerUseAgent):
    """
    Periodically capture screenshots from the browser and save them to the task state.
    
    Args:
        task_id: The ID of the task.
        agent: The agent running the task.
    """
    try:
        while True:
            if task_id not in task_states or task_states[task_id].get("stopped", False):
                break
            
            # Capture screenshot from browser if available
            if agent.browser and agent.browser.page:
                try:
                    # This is a placeholder - the actual implementation depends on
                    # how screenshots are handled in the browser-use library
                    screenshot = await agent.browser.page.screenshot()
                    if task_id in task_states:
                        # Save as BytesIO for streaming
                        from io import BytesIO
                        task_states[task_id]["browser_image"] = BytesIO(screenshot)
                except Exception as e:
                    logger.error(f"Error capturing screenshot for task {task_id}: {e}", exc_info=True)
            
            await asyncio.sleep(1)  # Capture every second
    except asyncio.CancelledError:
        logger.debug(f"Screenshot capture for task {task_id} cancelled")
    except Exception as e:
        logger.error(f"Error in screenshot capture for task {task_id}: {e}", exc_info=True)

async def process_user_messages(task_id: str, agent: ComputerUseAgent):
    """
    Process messages from the user to the agent.
    
    Args:
        task_id: The ID of the task.
        agent: The agent running the task.
    """
    if task_id not in message_queues:
        message_queues[task_id] = asyncio.Queue()
    
    queue = message_queues[task_id]
    
    try:
        while True:
            if task_id not in task_states or task_states[task_id].get("stopped", False):
                break
            
            # Check if there are any messages in the queue
            try:
                message = await asyncio.wait_for(queue.get(), timeout=0.5)
                
                # Update reasoning with user message
                if task_id in task_states:
                    task_states[task_id]["reasoning"] = f"User message: {message}\n\n{task_states[task_id].get('reasoning', '')}"
                
                # Send message to agent
                # This is a placeholder - the actual implementation depends on
                # how messages are handled in the browser-use library
                if agent.agent:
                    # Add to agent's context or processing queue
                    logger.info(f"Received message for task {task_id}: {message}")
                    
                    # In a real implementation, you would call agent.send_message(message)
                    # or similar functionality available in your agent class
                    
                queue.task_done()
            except asyncio.TimeoutError:
                # No messages in the queue
                pass
            
            await asyncio.sleep(0.1)  # Small delay to prevent CPU spinning
    except asyncio.CancelledError:
        logger.debug(f"Message processing for task {task_id} cancelled")
    except Exception as e:
        logger.error(f"Error processing messages for task {task_id}: {e}", exc_info=True)

def start_server():
    """Start the FastAPI server."""
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    start_server() 