"""Flask API serving admission predictions on http://localhost:5001."""
from flask import Flask, jsonify, request
from flask_cors import CORS

from predict import load_model, predict_chance
from preprocessing.preprocess import FEATURES

app = Flask(__name__)
CORS(app)

# Load once at startup; train.py must have been run first.
try:
    load_model()
    MODEL_READY = True
except FileNotFoundError:
    MODEL_READY = False


@app.get("/health")
def health():
    return jsonify({"status": "ok", "modelReady": MODEL_READY})


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True) or {}
    missing = [f for f in FEATURES if f not in payload]
    if missing:
        return jsonify({"error": f"Missing features: {', '.join(missing)}"}), 400
    if not MODEL_READY:
        return jsonify({"error": "Model not trained. Run train.py first."}), 503
    try:
        chance = predict_chance(payload)
    except (TypeError, ValueError) as exc:
        return jsonify({"error": f"Invalid feature values: {exc}"}), 400
    return jsonify({"chanceOfAdmit": chance})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
