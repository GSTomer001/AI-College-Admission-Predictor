"""Standalone prediction helper — loads the trained model and predicts one student."""
import os

import joblib

from preprocessing.preprocess import MODELS_DIR, as_feature_vector, load_scaler

MODEL_PATH = os.path.join(MODELS_DIR, "admission_model.pkl")


def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Model not found. Run `python train.py` first to train and save it."
        )
    model = joblib.load(MODEL_PATH)
    scaler = load_scaler()
    return model, scaler


def predict_chance(payload):
    """payload keys: gre, toefl, rating, sop, lor, cgpa, research."""
    model, scaler = load_model()
    X = as_feature_vector(payload)
    if scaler is not None:
        X = scaler.transform(X)
    chance = float(model.predict(X)[0])
    return round(min(max(chance, 0.01), 0.99), 4)


if __name__ == "__main__":
    sample = {
        "gre": 320,
        "toefl": 110,
        "rating": 4,
        "sop": 4.5,
        "lor": 4.5,
        "cgpa": 9.0,
        "research": 1,
    }
    print(f"Chance of admit: {predict_chance(sample)}")
