from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from google.cloud import firestore

from app.services.supabase import get_supabase_client
from app.security.auth import get_current_user
from app.services.agent import AgentService

router = APIRouter()
agent_service = AgentService()

class ChatMessage(BaseModel):
    role: str
    content: str
    image: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    role: str
    content: str
    tool_called: Optional[str] = None
    tool_result: Optional[Dict[str, Any]] = None

@router.post("/", response_model=ChatResponse)
async def chat_with_nexus(
    request: ChatRequest,
    # user = Depends(get_current_user) # Uncomment when auth is fully required
):
    """
    Sends a conversation to the NEXUS AI Agent.
    The agent may execute tools (e.g., create an incident) and return the final answer.
    """
    try:
        # Convert pydantic models to dicts for the service
        messages_dict = [{"role": msg.role, "content": msg.content, "image": msg.image} for msg in request.messages]
        
        result = await agent_service.chat(messages_dict)
        
        return ChatResponse(
            role=result.get("role", "model"),
            content=result.get("content", ""),
            tool_called=result.get("tool_called"),
            tool_result=result.get("tool_result")
        )
    except Exception as e:
        print(f"Chat API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
