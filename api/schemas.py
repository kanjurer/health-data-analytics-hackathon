from pydantic import BaseModel
from typing import Optional

class AgentCreate(BaseModel):
    id: str
    name: str
    persona_json: str

class TweetInput(BaseModel):
    content: str
    label: str
    agent_reaction: Optional[str] = None

class RunCreate(BaseModel):
    id: str
    agent_id: str
