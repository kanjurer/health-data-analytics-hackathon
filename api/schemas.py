from pydantic import BaseModel
from typing import Optional, List, Literal


class AgentCreate(BaseModel):
    id: Optional[str] = None
    name: str
    age: int
    description: str = ""
    gender: Literal['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say']
    nationality: str
    education: Literal[
        'No Formal Education', 'High School', 'College', 'Postgraduate', 'PhD'
    ]
    income_bracket: Literal['Low', 'Middle', 'High']
    occupation: str
    location_type: Literal['Urban', 'Suburban', 'Rural']
    marital_status: Literal['Single', 'Married', 'Divorced', 'Widowed']
    number_of_children: Optional[int] = 0
    prior_vaccine_experience: Literal['Positive', 'Negative', 'Neutral', 'None']
    vaccine_belief: Literal['Supportive', 'Hesitant', 'Opposed', 'Neutral']
    personality_traits: List[str] # maybe add keywords here
    exposure: Optional[int] = 2

class RunCreate(BaseModel):
    agents: List[AgentCreate]
    countries: List[str]
    duration: int
    fakeActors: int
    population: int
    speed: int

class GraphCreate(BaseModel):
    agent_id: str
    x: float
    y: float
    hesitancy: str
    recommendation: str
    beliefs: list[str]
