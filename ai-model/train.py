"""
Train the admission chance model and save it (plus the scaler) to disk.
"""
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from preprocessing.preprocess import (
    DATA_DIR,
    MODELS_DIR,
    load_training_data,
    save_scaler,
)

RNG_SEED = 42


def generate_synthetic_dataset(n_rows=1200, seed=RNG_SEED):
    """Create a realistic synthetic admission dataset (UCLA-style features)."""
    rng = np.random.default_rng(seed)
    gre = rng.integers(290, 341, n_rows)                 # 290-340
    toefl = rng.integers(90, 121, n_rows)                # 90-120
    rating = rng.integers(1, 6, n_rows)                  # 1-5
    sop = np.round(rng.uniform(1, 5, n_rows), 1)         # 1.0-5.0
    lor = np.round(rng.uniform(1, 5, n_rows), 1)         # 1.0-5.0
    cgpa = np.round(rng.uniform(6.0, 10.0, n_rows), 2)   # 6.0-10.0
    research = rng.integers(0, 2, n_rows)                # 0/1

    # Weighted "quality score" turned into an admission probability.
    score = (
        (gre - 290) / 50 * 0.30
        + (toefl - 90) / 30 * 0.15
        + (rating - 1) / 4 * 0.10
        + (sop - 1) / 4 * 0.10
        + (lor - 1) / 4 * 0.10
        + (cgpa - 6) / 4 * 0.20
        + research * 0.05
    )
    noise = rng.normal(0, 0.05, n_rows)
    chance = np.clip(score + noise, 0.02, 0.98)

    return pd.DataFrame(
        {
            "GRE_Score": gre,
            "TOEFL_Score": toefl,
            "University_Rating": rating,
            "SOP": sop,
            "LOR": lor,
            "CGPA": cgpa,
            "Research": research,
            "Chance_of_Admit": np.round(chance, 3),
        }
    )


def ensure_dataset():
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, "admission_data.csv")
    if not os.path.exists(path):
        print(f"Dataset not found at {path} — generating synthetic data...")
        generate_synthetic_dataset().to_csv(path, index=False)
        print("Synthetic dataset created (1200 rows).")
    return path


def train():
    ensure_dataset()
    X, y = load_training_data()
    if X is None:
        raise RuntimeError("Failed to load training data.")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RNG_SEED
    )

    scaler = StandardScaler().fit(X_train)
    X_train_s = scaler.transform(X_train)
    X_test_s = scaler.transform(X_test)

    model = GradientBoostingRegressor(
        n_estimators=300, learning_rate=0.05, max_depth=3, random_state=RNG_SEED
    )
    model.fit(X_train_s, y_train)

    preds = model.predict(X_test_s)
    print(f"R2 score      : {r2_score(y_test, preds):.4f}")
    print(f"MAE           : {mean_absolute_error(y_test, preds):.4f}")

    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODELS_DIR, "admission_model.pkl"))
    save_scaler(scaler)
    print(f"Saved model + scaler to {MODELS_DIR}")


if __name__ == "__main__":
    train()
