type AgentMeta = {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  education: string;
  income_bracket: string;
  occupation: string;
  location_type: string;
  marital_status: string;
  number_of_children: number;
  prior_vaccine_experience: string;
  vaccine_belief: string;
  description?: string;
  personality_traits?: string[];
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
  agents: AgentMeta[];
  exposure: number;
};

type Tweet = {
  id: number;
  content: string;
  created_by: string;
};
