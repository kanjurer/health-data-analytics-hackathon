from schemas import AgentCreate

def agent_to_string(agent: AgentCreate):
    return f"""Name: {agent.name}
Age: {agent.age}
Description: {agent.description}
Gender: {agent.gender}
Nationality: {agent.nationality}
Education: {agent.education}
Income Bracket: {agent.income_bracket}
Occupation: {agent.occupation}
Location Type: {agent.location_type}
Marital Status: {agent.marital_status}
Number of Children: {agent.number_of_children}
Prior Vaccine Experience: {agent.prior_vaccine_experience}
Vaccine Belief: {agent.vaccine_belief}
Personality Traits: {', '.join(agent.personality_traits)}
"""
    
    