import dspy
from dspy import Signature, InputField, OutputField, ChainOfThought
from schemas import GraphCreate

from sentence_transformers import SentenceTransformer, util
from schemas import GraphCreate
model = SentenceTransformer('all-MiniLM-L6-v2')  # global model


def cosine_similarity_between_texts(text1: str, text2: str) -> float:
    embeddings = model.encode([text1, text2], normalize_embeddings=True)
    text1_emb, text2_emb = embeddings
    return util.cos_sim(text1_emb, text2_emb).item()



# Step 1: DSPy signature
class OpinionScore(Signature):
    """Score vaccine statements between 0 and 10"""
    statement: str = InputField()
    question_type: str = InputField(desc="Either 'hesitancy' or 'recommendation'")
    score: str = OutputField(desc="Only a number between 0 and 10")

# Step 2: DSPy module for scoring
class ScoreOpinionModule(dspy.Module):
    def __init__(self, temperature=0.0):
        super().__init__()
        self.scorer = ChainOfThought(OpinionScore, temperature=temperature)

    def forward(self, statement: str, question_type: str) -> float:
        result = self.scorer(statement=statement, question_type=question_type)
        try:
            return float(result.score.strip())
        except Exception as e:
            print(f"⚠️ Invalid score output: {result.score} ({e})")
            return 5.0

# Step 3: Function to project opinions into 2D space
def map_opinion_data_to_2d(data: list[dict]) -> list[GraphCreate]:
    scorer = ScoreOpinionModule()

    results = []
    for entry in data:
        x = scorer(entry["hesitancy"], "hesitancy")
        y = scorer(entry["recommendation"], "recommendation")

        results.append(GraphCreate(
            agent_id=entry["agent_id"],
            x=x,
            y=y,
            hesitancy=entry["hesitancy"],
            recommendation=entry["recommendation"],
            beliefs=entry["belief"],
            run_id=entry["run_id"],
        ))

    return results

# Step 4: DSPy LLM setup
# You can replace this with Gemini or other DSPy-compatible LLM
lm = dspy.LM('openai/gpt-4', api_key='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')  # replace with your key
dspy.settings.configure(
    lm=lm)  # replace with your key
