import json
from pathlib import Path
from pydantic import BaseModel, Field

class Tweets(BaseModel):
    tweets: list[str] = Field(description="List of tweets")

class GoodAgent:
    def __init__(self, json_path: str = "./factual_tweets.json"):
        self.json_path = Path(json_path)
        self._tweets = self._load_tweets()
        self._pointer = 0

    def _load_tweets(self) -> list[str]:
        if not self.json_path.exists():
            raise FileNotFoundError(f"Tweet file not found: {self.json_path}")
        with open(self.json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data

    def execute(self) -> list[str]:
        if not self._tweets:
            return []

        start = (self._pointer) % len(self._tweets)
        end = (self._pointer + 3 )% len(self._tweets)  # wrap around
        batch = self._tweets[start:end]

        self._pointer = end if end < len(self._tweets) else 0  # loop back
        return batch

def create_good_agent() -> GoodAgent:
    return GoodAgent()
