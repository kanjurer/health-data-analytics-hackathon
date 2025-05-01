from sentence_transformers import SentenceTransformer, util
from schemas import GraphCreate
model = SentenceTransformer('all-MiniLM-L6-v2')  # global model

# Define extremum anchor texts
HESITANCY_ANCHORS = {
    "min": "I support vaccines and have no hesitancy.",
    "max": "I distrust vaccines and will never take them."
}

RECOMMENDATION_ANCHORS = {
    "min": "I advise against taking any vaccines.",
    "max": "I recommend everyone get vaccinated."
}

def similarity_score(text: str, anchor_min: str, anchor_max: str) -> float:
    """Scores a text between two anchors using cosine similarity"""
    embeddings = model.encode([text, anchor_min, anchor_max], normalize_embeddings=True)
    text_emb, anchor_min_emb, anchor_max_emb = embeddings
    
    sim_min = util.cos_sim(text_emb, anchor_min_emb).item()
    sim_max = util.cos_sim(text_emb, anchor_max_emb).item()
    
    if sim_min == 0 and sim_max == 0:
        return 0.5

    return (1 - sim_min + sim_max) / 2

def map_opinion_data_to_2d(data: list[dict]) -> list[GraphCreate]:
    """Projects agent opinions to 2D space using similarity to fixed anchors"""
    results = []
    for entry in data:
        x = similarity_score(entry["hesitancy"], HESITANCY_ANCHORS["min"], HESITANCY_ANCHORS["max"])
        y = similarity_score(entry["recommendation"], RECOMMENDATION_ANCHORS["min"], RECOMMENDATION_ANCHORS["max"])
        
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
