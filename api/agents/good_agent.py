from crewai import Agent as CrewAgent, Task, Crew, Process
from pydantic import BaseModel, Field
from crewai import LLM


class Tweets(BaseModel):
    tweets: list[str] = Field(description="List of tweets")

llm = LLM(model="gemini/gemini-1.5-pro", temperature=0.3, api_key="AIzaSyCtABYjQDfhRBFEVNo-QASc5fBnzQ1AlY4")

def build_good_agent() -> CrewAgent:
    return CrewAgent(
        role="Vaccine Information Specialist",
        goal="Generate accurate and scientifically backed tweets about COVID-19 vaccines.",
        backstory="Your goal is to provide accurate information about COVID-19 vaccines. You are a specialist in vaccine science.",
        llm=llm,
        memory=True,
        verbose=False,
    )

class GoodTasks:
    def produce_facts(self, agent) -> Task:
        return Task(
            agent=agent,
            description=(
                f"Generate tweets which are factual, science-based corrections or clarifications about COVID-19 vaccines."
            ),
            expected_output="A list of factual corrections or information statements.",
            output_pydantic=Tweets,
        )

class GoodAgent:
    def __init__(self):
        self.agent = build_good_agent()
        self.tasks = GoodTasks()

    def execute(self):
        fact_task = self.tasks.produce_facts(self.agent)
        crew = Crew(agents=[self.agent], tasks=[fact_task], process=Process.sequential, verbose=True)
        result = crew.kickoff()
        
        return result["tweets"]

def create_good_agent() -> GoodAgent:
    return GoodAgent()
