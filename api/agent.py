from autogen import ConversableAgent

# Agent Class
class NaiveAgent(ConversableAgent):
    def __init__(self, name, persona):
        super().__init__(name=name)
        self.persona = persona
        self.memory = []

    def _format_persona(self):
        return (f"{self.persona['name']} is a {self.persona['age']}-year-old "
                f"{self.persona['education']} graduate, who is {self.persona['vaccine_belief']} about vaccines.")

    def absorb_tweet(self, tweet):
        prompt = f"""
You are {self._format_persona()}.
You read the following tweet:
"{tweet}"

Reflect on how this affects your vaccine beliefs.
"""
        response = self.generate_reply(prompt)
        self.memory.append(response)

    def reflect(self):
        prompt = f"""
You have read several tweets. Here's your reflection log:
{''.join(self.memory)}

Answer:
1. Would you take the COVID-19 vaccine now? (Yes/No)
2. How likely are you to recommend it to others (1-5)?
3. Why or why not?
"""
        return self.generate_reply(prompt)

