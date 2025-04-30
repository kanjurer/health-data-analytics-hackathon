from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime

Base = declarative_base()

class Agent(Base):
    __tablename__ = 'agents'
    id = Column(String, primary_key=True)
    name = Column(String)
    persona_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Run(Base):
    __tablename__ = 'runs'
    id = Column(String, primary_key=True)
    agent_id = Column(String)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    final_output = Column(Text)

class NewsExposure(Base):
    __tablename__ = 'news_exposures'
    id = Column(String, primary_key=True)
    run_id = Column(String)
    content = Column(Text)
    label = Column(String)
    agent_reaction = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
