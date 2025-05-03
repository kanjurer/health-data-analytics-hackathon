import json
import requests
import time

API_URL = 'http://localhost:8000/create_agent'

def load_agents(path='mock_agents.json'):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_agent(agent):
    response = requests.post(API_URL, json=agent)

def main():
    agents = load_agents()
    print(f"🚀 Creating {len(agents)} agents...")

    for agent in agents:
        create_agent(agent)
        time.sleep(0.05)  # Small delay to avoid spamming server

if __name__ == '__main__':
    main()
