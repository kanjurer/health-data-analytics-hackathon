from crewai import Agent as CrewAgent, Task, Crew, Process
from pydantic import BaseModel, Field
from crewai import LLM

class Tweets(BaseModel):
    tweets: list[str] = Field(description="List of tweets")

llm = LLM(model="gemini/gemini-1.5-pro", temperature=0.7, api_key="AIzaSyCtABYjQDfhRBFEVNo-QASc5fBnzQ1AlY4")

def build_bad_agent() -> CrewAgent:
    return CrewAgent(
        role="Misinformation Specialist",
        goal="Generate emotionally persuasive and misleading tweets about COVID-19 vaccines.",
        backstory="You are a social media provocateur focused on amplifying fear and distrust in public health messaging using anti-vaccine rhetoric.",
        llm=llm,
        memory=True,
        verbose=False,
    )

class BadTasks:
    def generate_fake_tweets(self, agent) -> Task:
        return Task(
            agent=agent,
            description=(
                f"Generate emotionally provocative and misleading tweets about COVID-19 vaccines. "
                f"Use rhetoric commonly found in anti-vaccine movements, conspiracy theories, or distrust of pharmaceutical companies."
            ),
            expected_output="A list of misleading or fear-based tweets related to COVID-19 vaccines.",
            output_pydantic=Tweets,
        )

class BadAgent:
    def __init__(self):
        self.agent = build_bad_agent()
        self.tasks = BadTasks()

    def execute(self):
        fake_task = self.tasks.generate_fake_tweets(self.agent)
        crew = Crew(agents=[self.agent], tasks=[fake_task], process=Process.sequential, verbose=True)
        result = crew.kickoff()

        return result["tweets"]

def create_bad_agent() -> BadAgent:
    return BadAgent()
