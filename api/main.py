from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import Agent, Run
from database import SessionLocal
import uuid

from schemas import AgentCreate, RunCreate, TweetInput
from agent import NaiveAgent

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# In-memory
AGENTS: dict[NaiveAgent]  = {}

@app.get("/")
def test():
    return {"message": "Hello, World!"}

@app.post("/add_agent/")
def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    db_agent = Agent(id=agent.id, name=agent.name, persona_json=agent.persona_json)
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@app.post("/start_run/")
def create_run(run: RunCreate, db: Session = Depends(get_db)):
    db_run = Run(id=run.id, agent_id=run.agent_id)
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

@app.post("/deploy_agent")
def create_agent(agent_id: str):
    persona = {
        "name": agent_id,
        "age": 35,
        "education": "Bachelor's degree",
        "vaccine_belief": "Neutral"
    }
    agent = NaiveAgent(agent_id, persona)
    AGENTS[agent_id] = agent
    return {"message": f"Agent {agent_id} created."}


@app.post("/feed_tweet/{agent_id}")
def feed_tweet(agent_id: str, input: TweetInput):
    agent = AGENTS.get(agent_id)
    if not agent:
        return {"error": "Agent not found"}
    agent.absorb_news(input.news_item)
    return {"message": "News absorbed"}

@app.get("/reflect/{agent_id}")
def reflect(agent_id: str):
    agent = AGENTS.get(agent_id)
    
    if not agent: return {"error": "Agent not found"}
    
    result = agent.reflect_and_decide()
    return {"decision": result}