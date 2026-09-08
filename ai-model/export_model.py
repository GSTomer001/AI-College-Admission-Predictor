"""Export the trained sklearn model to JSON so the frontend can run
the exact same prediction logic client-side (GitHub Pages demo mode).

Also self-verifies the exported JSON against model.predict() and writes
test samples for a Node-side cross-check.

Usage:  python export_model.py
Output: frontend/public/model.json  +  export_samples.json (for testing)
"""
import json
import os

import numpy as np

from predict import load_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_MODEL = os.path.join(BASE_DIR, "..", "frontend", "public", "model.json")
OUT_SAMPLES = os.path.join(BASE_DIR, "export_samples.json")


def rnd(values, nd=8):
    return [round(float(v), nd) for v in np.ravel(values)]


def main():
    model, scaler = load_model()

    data = {
        "scaler": {"mean": rnd(scaler.mean_), "scale": rnd(scaler.scale_)},
        "init": float(np.ravel(model.init_.constant_)[0]),
        "learningRate": float(model.learning_rate),
        "trees": [],
    }

    for est in np.ravel(model.estimators_):
        t = est.tree_
        data["trees"].append({
            "feature": [int(f) for f in t.feature],
            "threshold": rnd(t.threshold),
            "childrenLeft": [int(c) for c in t.children_left],
            "childrenRight": [int(c) for c in t.children_right],
            "value": rnd(t.value),
        })

    # --- pure-python inference from the exported JSON ---
    def exported_predict(raw):
        xs = [
            (raw[i] - data["scaler"]["mean"][i]) / data["scaler"]["scale"][i]
            for i in range(len(raw))
        ]
        total = data["init"]
        for tree in data["trees"]:
            node = 0
            while tree["childrenLeft"][node] != -1:
                go_left = xs[tree["feature"][node]] <= tree["threshold"][node]
                node = tree["childrenLeft"][node] if go_left else tree["childrenRight"][node]
            total += data["learningRate"] * tree["value"][node]
        return total

    # --- build test samples (fixed + random) and verify ---
    rng = np.random.default_rng(7)
    fixed = [
        {"gre": 320, "toefl": 110, "rating": 4, "sop": 4.5, "lor": 4.5, "cgpa": 9.0, "research": 1},
        {"gre": 300, "toefl": 95, "rating": 2, "sop": 2.5, "lor": 3.0, "cgpa": 7.2, "research": 0},
        {"gre": 340, "toefl": 120, "rating": 5, "sop": 5.0, "lor": 5.0, "cgpa": 9.8, "research": 1},
    ]
    randoms = [
        {
            "gre": int(rng.integers(290, 341)),
            "toefl": int(rng.integers(90, 121)),
            "rating": int(rng.integers(1, 6)),
            "sop": round(float(rng.uniform(1, 5)), 1),
            "lor": round(float(rng.uniform(1, 5)), 1),
            "cgpa": round(float(rng.uniform(6, 10)), 2),
            "research": int(rng.integers(0, 2)),
        }
        for _ in range(8)
    ]

    samples = []
    for raw in fixed + randoms:
        expected = float(model.predict(scaler.transform(np.array([list(raw.values())], dtype=float)))[0])
        mine = exported_predict(list(raw.values()))
        diff = abs(expected - mine)
        if diff > 1e-6:
            raise AssertionError(f"export mismatch {diff}: expected {expected}, got {mine}")
        samples.append({"input": raw, "expected": round(expected, 8)})

    # --- write outputs ---
    os.makedirs(os.path.dirname(OUT_MODEL), exist_ok=True)
    with open(OUT_MODEL, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"))
    with open(OUT_SAMPLES, "w", encoding="utf-8") as f:
        json.dump(samples, f, indent=2)

    size_kb = os.path.getsize(OUT_MODEL) / 1024
    print(f"Verified {len(samples)} samples against sklearn (max diff < 1e-6).")
    print(f"Exported {len(data['trees'])} trees -> {os.path.abspath(OUT_MODEL)} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
