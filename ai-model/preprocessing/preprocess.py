"""Load and scale features for the admission model."""
import os

import joblib
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "dataset")

FEATURES = ["gre", "toefl", "rating", "sop", "lor", "cgpa", "research"]

# Column names used inside admission_data.csv
CSV_COLUMNS = {
    "GRE_Score": "gre",
    "TOEFL_Score": "toefl",
    "University_Rating": "rating",
    "SOP": "sop",
    "LOR": "lor",
    "CGPA": "cgpa",
    "Research": "research",
    "Chance_of_Admit": "chance_of_admit",
}


def load_training_data(path=None):
    """Load the admission dataset and return (X, y) as numpy arrays."""
    path = path or os.path.join(DATA_DIR, "admission_data.csv")
    if not os.path.exists(path):
        return None, None
    df = pd.read_csv(path)
    df = df.rename(columns=CSV_COLUMNS)
    X = df[FEATURES].to_numpy(dtype=float)
    y = df["chance_of_admit"].to_numpy(dtype=float)
    return X, y


def load_scaler():
    path = os.path.join(MODELS_DIR, "scaler.pkl")
    if os.path.exists(path):
        return joblib.load(path)
    return None


def save_scaler(scaler):
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))


def as_feature_vector(payload):
    """Convert an API payload dict into the ordered feature vector."""
    return np.array([[float(payload.get(f, 0)) for f in FEATURES]], dtype=float)
