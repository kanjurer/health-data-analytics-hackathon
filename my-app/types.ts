type AgentMeta = {
  name: string;
  description: string;
};

type Agent = {
  id: number;
  trust: number;
  hesitancy: number;
};

type SimulationConfig = {
  population: number;
  fakeActors: number;
  duration: number;
  speed: number;
  customAgents: AgentMeta[];
};
