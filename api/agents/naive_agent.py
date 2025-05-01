from crewai import Agent as CrewAgent, Task, Crew, Process
from pydantic import BaseModel
from schemas import AgentCreate
from utils import agent_to_string
from crewai import LLM

# Models
class Belief(BaseModel):
    beliefs: list[str]

class Hesitancy(BaseModel):
    hesitancy: str

class Recommendation(BaseModel):
    recommendation: str

# LLM + tools
llm = LLM(model="gemini/gemini-1.5-pro", temperature=0.7, api_key="AIzaSyCtABYjQDfhRBFEVNo-QASc5fBnzQ1AlY4")

# Build CrewAgent
def build_naive_agent(agent: AgentCreate) -> CrewAgent:
    return CrewAgent(
        role="Tweet Analyzer",
        goal="Continuously update your beliefs and attitude about vaccines based on tweets and your personality.",
        backstory=agent_to_string(agent),
        llm=llm,
        memory=True,
        verbose=False
    )

# Task builder
class NaiveTasks:
    def absorb(self, agent, tweets: list[str], beliefs: list[str]) -> Task:
        return Task(
            agent=agent,
            description=(
                f"You just received these tweets:\n\n\"{tweets}\"\n\n"
                f"Based on your current beliefs ({beliefs}) and personality, reflect on how these tweets affects you. "
                f"Update your beliefs accordingly. You may reinforce, discard, or add new beliefs."
            ),
            expected_output="A list of updated beliefs based on the tweet, and your judgement.",
            output_pydantic=Belief,
        )

    def hesitancy(self, agent, beliefs: list[str]) -> Task:
        return Task(
            agent=agent,
            description=(
                f"Given your beliefs ({beliefs}), how hesitant are you about taking the COVID-19 vaccine now? "
                f"Use language like 'Very hesitant', 'Neutral', or 'Not hesitant at all', and provide a brief explanation."
            ),
            expected_output="Describe your current hesitancy level.",
            output_pydantic=Hesitancy,
        )

    def recommend(self, agent, beliefs: list[str]) -> Task:
        return Task(
            agent=agent,
            description=(
                f"Considering your beliefs ({beliefs}), how likely are you to recommend the vaccine to others?"
            ),
            expected_output="Describe your recommendation tendency.",
            output_pydantic=Recommendation,
        )


class NaiveAgent:
    def __init__(self, agent_meta: AgentCreate):
        self.agent_meta = agent_meta
        self.agent = build_naive_agent(agent_meta)
        self.tasks = NaiveTasks()
        self.beliefs = [] 
        self.exposure = agent_meta.exposure
    
    def get_id(self):
        return self.agent_meta.id

    def execute(self, tweets: list[str]):
        absorb_task = self.tasks.absorb(self.agent, tweets[:min(len(tweets), self.exposure)], self.beliefs)
        
        hesitancy_task = self.tasks.hesitancy(self.agent, absorb_task)
        
        recommendation_task = self.tasks.recommend(self.agent, absorb_task)
            
        crew1 = Crew(agents=[self.agent], tasks=[absorb_task], process=Process.sequential, verbose=True)
        crew2 = Crew(agents=[self.agent], tasks=[hesitancy_task], process=Process.sequential, verbose=True)
        crew3 = Crew(agents=[self.agent], tasks=[recommendation_task], process=Process.sequential, verbose=True)
        
        
        result1 = crew1.kickoff()            
        result2 = crew2.kickoff()
        result3 = crew3.kickoff()
        
        return result1["beliefs"], result2["hesitancy"], result3["recommendation"]

def create_naive_agent(agent_meta: AgentCreate) -> NaiveAgent:
    return NaiveAgent(agent_meta)