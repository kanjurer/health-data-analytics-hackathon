from sqlalchemy import Column, String, Text, DateTime, Integer, Float, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

# run_agents = Table(
#     'run_agents',
#     Base.metadata,
#     Column('run_id', String, ForeignKey('runs.id'), primary_key=True),
#     Column('agent_id', String, ForeignKey('agents.id'), primary_key=True)
# )

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Enum
from sqlalchemy.orm import relationship
import datetime
import enum

class GenderEnum(enum.Enum):
    Male = 'Male'
    Female = 'Female'
    NonBinary = 'Non-binary'
    Other = 'Other'
    PreferNotToSay = 'Prefer not to say'

class EducationEnum(enum.Enum):
    NoneFormal = 'No Formal Education'
    HighSchool = 'High School'
    College = 'College'
    Postgraduate = 'Postgraduate'
    PhD = 'PhD'

class IncomeEnum(enum.Enum):
    Low = 'Low'
    Middle = 'Middle'
    High = 'High'

class VaccineExpEnum(enum.Enum):
    Positive = 'Positive'
    Negative = 'Negative'
    Neutral = 'Neutral'
    NoneExp = 'None'

class VaccineBeliefEnum(enum.Enum):
    Supportive = 'Supportive'
    Hesitant = 'Hesitant'
    Opposed = 'Opposed'
    Neutral = 'Neutral'

class Agent(Base):
    __tablename__ = 'agents'

    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(Text)
    age = Column(Integer)
    gender = Column(String)
    nationality = Column(String)
    education = Column(String)
    income_bracket = Column(String)
    occupation = Column(String)
    location_type = Column(String)  
    marital_status = Column(String) 
    number_of_children = Column(Integer, default=0)
    has_children = Column(Boolean)
    prior_vaccine_experience = Column(String)
    vaccine_belief = Column(String)

    personality_traits = Column(Text)  # Could store JSON stringified list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    exposure = Column(Integer)


class Run(Base):
    __tablename__ = 'runs'
    
    id = Column(String, primary_key=True)
    population = Column(Integer)
    fake_actors = Column(Float)
    total_duration = Column(Integer)
    speed = Column(Float)
    running = Column(Boolean, default=True)
    paused = Column(Boolean, default=False)
    duration_remaining = Column(Integer)
    num_good_agents = Column(Integer)
    num_bad_agents = Column(Integer)
    num_naive_agents = Column(Integer)
    

class Tweet(Base):
    __tablename__ = 'tweets'
    
    id = Column(String, primary_key=True)
    content = Column(Text)
    created_by = Column(String)


class Graph(Base):
    __tablename__ = 'graphs'
    
    id = Column(String, primary_key=True)
    agent_id = Column(String, ForeignKey('agents.id'))
    run_id = Column(String, ForeignKey('runs.id'))
    x = Column(Float)
    y = Column(Float)
    hesitancy = Column(Text)
    recommendation = Column(Text)
    beliefs = Column(Text)
    duration_remaining = Column(Integer)
    
    