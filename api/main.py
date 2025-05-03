from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from models import Agent, Run, Tweet, Graph
from database import SessionLocal
from uuid import uuid4
import json
from fastapi.middleware.cors import CORSMiddleware
import time
from schemas import AgentCreate, RunCreate, GraphCreate
import random

from agents.naive_agent import create_naive_agent
from agents.good_agent import create_good_agent
from agents.bad_agent import create_bad_agent
from semantic_similarity import map_opinion_data_to_2d
from semantic_similarity import cosine_similarity_between_texts

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In-memory
RUN = None
AGENTS = {
    "naive": [],
    "good": [],
    "bad": [],
}

@app.get("/")
def test():
    return {"message": "Hello, World!"}



# simulation runs
def run_simulation_task(run_id: str, db):
    while RUN["running"]:
        if RUN["paused"]:
            time.sleep(1)
            print("Simulation paused")
            continue

        print(f"Running step for {run_id}")

        if RUN["duration_remaining"] > 0:
            RUN["duration_remaining"] -= 1
            graph = execute_agents(db)
            RUN["graph"] = graph
        else:
            RUN["running"] = False
            print("Simulation completed")
        
        
@app.post("/start_run/")
def create_run(run: RunCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    global RUN
    
    db_run = Run(id=str(uuid4()), population=run.population, fake_actors=run.fakeActors, total_duration=run.duration, speed=run.speed, running=True, paused=False, duration_remaining=run.duration,num_good_agents=run.population-run.fakeActors, num_bad_agents=run.fakeActors, num_naive_agents=len(run.agents))
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    
    # initialize all agents
    agents = []
    for agent in run.agents:
        db_agent = db.query(Agent).filter(Agent.id == agent.id).first()
        if not db_agent: raise HTTPException(status_code=404, detail="Agent not found")
        agents.append(db_agent)
        
    
    # create good and bad agents   
    run_id = str(db_run.id)
    RUN = {
        "running": True,
        "paused": False,
        "run_id": run_id,
        "duration_remaining": run.duration,
        "speed": run.speed,
        "population": run.population,
        "total_duration": run.duration,
        "tweetfeed": [],
        "graph": [],
    }
    
    AGENTS["naive"]= naive_agents(agents)
    AGENTS["good"] = good_agents(run.population, run.fakeActors)
    AGENTS["bad"] = bad_agents(run.population, run.fakeActors)
    
    background_tasks.add_task(run_simulation_task, run_id, db)

    return {"status": "started", "run_id": run_id}





# Simulation Controls
######
######
######
@app.post("/pause_run/")
def pause_run(db: Session = Depends(get_db)):
    RUN["paused"] = True
    
    db_run = db.query(Run).filter(Run.id == RUN["run_id"]).first()
    if db_run:
        db_run.running = RUN["running"]
        db_run.paused = RUN["paused"]
        db_run.duration_remaining = RUN["duration_remaining"]
        db.commit()
    
    return RUN

@app.post("/resume_run/")
def resume_run(db: Session = Depends(get_db)):
    RUN["paused"] = False
    
    db_run = db.query(Run).filter(Run.id == RUN["run_id"]).first()
    if db_run:
        db_run.running = RUN["running"]
        db_run.paused = RUN["paused"]
        db_run.duration_remaining = RUN["duration_remaining"]
        db.commit()
    
    return RUN

@app.post("/stop_run/")
def stop_run(db: Session = Depends(get_db)):
    RUN["running"] = False
    
    db_run = db.query(Run).filter(Run.id == RUN["run_id"]).first()
    if db_run:
        db_run.running = RUN["running"]
        db_run.paused = RUN["paused"]
        db_run.duration_remaining = RUN["duration_remaining"]
        db.commit()
    
    return RUN


@app.get("/status_run/")
def get_run_status(db: Session = Depends(get_db)):
    db_run = db.query(Run).filter(Run.id == RUN["run_id"]).first()
    if db_run:
        db_run.running = RUN["running"]
        db_run.paused = RUN["paused"]
        db_run.duration_remaining = RUN["duration_remaining"]
        db.commit()
    
    return RUN

@app.post("/reset_run/")
def reset_run():
    global RUN
    RUN = {
        "running": False,
        "paused": False,
        "run_id": None,
        "duration_remaining": 0,
        "speed": 1.0,
        "population": 0,
        "total_duration": 0,
        "tweetfeed": [],
        "graph": [],
    }
    
    return RUN




















# utils here
def naive_agents(agents):
    arr = []
    for agent in agents:
        arr.append(create_naive_agent(agent))
    
    return arr


def good_agents(population, fakeActors):
    arr = []
    total_agents = fakeActors
    
    for _ in range(total_agents):
        arr.append(create_good_agent())
    
    return arr
    

def bad_agents(population, fakeActors):
    arr = []
    total_agents = population - fakeActors
    
    for _ in range(total_agents):
        arr.append(create_bad_agent())
    
    return arr


def execute_agents(db) -> list[GraphCreate]:
    new_tweets = []
    for agent in AGENTS["good"]:
        y = agent.execute()
        for x in y:
            new_tweets.append(y)
            db_tweet = Tweet(id=str(uuid4()), content=x, created_by="good_agent")

            db.add(db_tweet)
            db.commit()
            db.refresh(db_tweet)
            RUN["tweetfeed"].append({
                "id": db_tweet.id,
                "content": db_tweet.content,
                "created_by": db_tweet.created_by,
            })
    
    for agent in AGENTS["bad"]:
        y = agent.execute()
        for x in y:
            new_tweets.append(y)
            db_tweet = Tweet(id=str(uuid4()), content=x, created_by="bad_agent")

            db.add(db_tweet)
            db.commit()
            db.refresh(db_tweet)
            RUN["tweetfeed"].append({
                "id": db_tweet.id,
                "content": db_tweet.content,
                "created_by": db_tweet.created_by,
            })
    
    random.shuffle(new_tweets)
            
    data = []
    for agent in AGENTS["naive"]:
        belief, hesitancy, recommendation = agent.execute(new_tweets)
        data.append({
            "belief": belief,
            "hesitancy": hesitancy,
            "recommendation": recommendation,
            "agent_id": agent.get_id(),
            "run_id": RUN["run_id"],
        })
        
    
    # pairwise bert based similarities
    graphs = map_opinion_data_to_2d(data)
    
    for graph in graphs:
        db_graph = Graph(
            id=str(uuid4()),
            agent_id=graph.agent_id,
            run_id=RUN["run_id"],
            x=graph.x,
            y=graph.y,
            hesitancy=graph.hesitancy,
            recommendation=graph.recommendation,
            beliefs=",".join(graph.beliefs),
            duration_remaining=RUN["duration_remaining"],
        )
        
        db.add(db_graph)
        db.commit()
        db.refresh(db_graph)
        
        RUN["graph"].append({
            "id": db_graph.id,
            "agent_id": db_graph.agent_id,
            "run_id": db_graph.run_id,
            "x": db_graph.x,
            "y": db_graph.y,
            "hesitancy": db_graph.hesitancy,
            "recommendation": db_graph.recommendation,
            "belief": db_graph.beliefs,
        })
    
    return graphs
    
    
@app.get("/summary_run/{run_id}")
def get_run_summary(run_id: str, db: Session = Depends(get_db)):
    db_run = db.query(Run).filter(Run.id == run_id).first()
    if not db_run:
        raise HTTPException(status_code=404, detail="Run not found")

    # Get all graph entries ordered by time
    graph = (
        db.query(Graph)
        .filter(Graph.run_id == run_id)
        .order_by(Graph.agent_id, Graph.duration_remaining.desc())
        .all()
    )

    # Build per-agent belief histories
    belief_history: dict[str, list[str]] = {}
    graph_response: list[dict] = []

    for g in graph:
        agent_id = g.agent_id
        prev_beliefs = belief_history.get(agent_id, [])
        current_beliefs = g.beliefs or ""

        if not prev_beliefs:
            belief_change = 0.0
        else:
            belief_change = cosine_similarity_between_texts(prev_beliefs[-1], current_beliefs)

        # Update history
        belief_history.setdefault(agent_id, []).append(current_beliefs)

        graph_response.append({
            "agent_id": agent_id,
            "x": g.x,
            "y": g.y,
            "hesitancy": g.hesitancy,
            "recommendation": g.recommendation,
            "beliefs": current_beliefs,
            "duration_remaining": g.duration_remaining,
            "belief_change": round(belief_change, 4)
        })

    # Attach agents
    agent_ids = list({g.agent_id for g in graph})
    agents = db.query(Agent).filter(Agent.id.in_(agent_ids)).all()

    return {
        "run": {
            "id": db_run.id,
            "population": db_run.population,
            "fake_actors": db_run.fake_actors,
            "total_duration": db_run.total_duration,
            "speed": db_run.speed,
            "running": db_run.running,
            "paused": db_run.paused,
            "duration_remaining": db_run.duration_remaining,
            "num_good_agents": db_run.num_good_agents,
            "num_bad_agents": db_run.num_bad_agents,
            "num_naive_agents": db_run.num_naive_agents
        },
        "graph": graph_response,
        "agents": [
            {
                "id": a.id,
                "name": a.name,
                "description": a.description,
                "age": a.age,
                "gender": a.gender,
                "nationality": a.nationality,
                "education": a.education,
                "income_bracket": a.income_bracket,
                "occupation": a.occupation,
                "location_type": a.location_type,
                "marital_status": a.marital_status,
                "number_of_children": a.number_of_children,
                "has_children": a.has_children,
                "prior_vaccine_experience": a.prior_vaccine_experience,
                "vaccine_belief": a.vaccine_belief,
                "personality_traits": a.personality_traits,
                "created_at": a.created_at,
                "exposure": a.exposure
            } for a in agents
        ]
    }


@app.get("/runs/")
def get_runs(db: Session = Depends(get_db)):
    runs = db.query(Run).all()
    result = []
    for run in runs:
        result.append({
            "id": run.id,
            "population": run.population,
            "fake_actors": run.fake_actors,
            "total_duration": run.total_duration,
            "speed": run.speed,
            "running": run.running,
            "paused": run.paused,
            "duration_remaining": run.duration_remaining,
            "num_good_agents": run.num_good_agents,
            "num_bad_agents": run.num_bad_agents,
            "num_naive_agents": run.num_naive_agents
        })
        
    return result



###########






# agents
@app.get("/agents/")
def get_agents(db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
    result = []
    for agent in agents:
        result.append({
            "id": agent.id,
            "name": agent.name,
            "description": agent.description,
            "age": agent.age,
            "gender": agent.gender,
            "nationality": agent.nationality,
            "education": agent.education,
            "income_bracket": agent.income_bracket,
            "occupation": agent.occupation,
            "location_type": agent.location_type,
            "marital_status": agent.marital_status,
            "number_of_children": agent.number_of_children,
            "has_children": agent.has_children,
            "prior_vaccine_experience": agent.prior_vaccine_experience,
            "vaccine_belief": agent.vaccine_belief,
            "personality_traits": json.loads(agent.personality_traits) if agent.personality_traits else [],
            "created_at": agent.created_at,
        })
    return result

@app.post("/create_agent/")
def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    db_agent = Agent(
        id=str(uuid4()),
        name=agent.name,
        description=agent.description,
        age=agent.age,
        gender=agent.gender,
        nationality=agent.nationality,
        education=agent.education,
        income_bracket=agent.income_bracket,
        occupation=agent.occupation,
        location_type=agent.location_type,
        marital_status=agent.marital_status,
        number_of_children=agent.number_of_children,
        has_children=(agent.number_of_children or 0) > 0,
        prior_vaccine_experience=agent.prior_vaccine_experience,
        vaccine_belief=agent.vaccine_belief,
        personality_traits=json.dumps(agent.personality_traits),
        exposure=agent.exposure,
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)

    return {
        "status": "success",
        "message": "Agent created successfully",
        "agent": {
            "id": db_agent.id,
            "name": db_agent.name,
            "description": db_agent.description,
            "age": db_agent.age,
    }}

@app.delete("/delete_agent/{agent_id}")
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    db_agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not db_agent:
        return {"error": "Agent not found"}
    
    db.delete(db_agent)
    db.commit()
    
    return {"message": "Agent deleted successfully"}

