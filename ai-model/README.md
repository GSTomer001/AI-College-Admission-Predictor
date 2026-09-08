# AI Model Service 🤖

Python microservice that predicts a student's chance of college admission.

## Files

- `dataset/admission_data.csv` — training data (GRE, TOEFL, university rating, SOP, LOR, CGPA, research → chance of admit). Auto-generated synthetically on first training run if missing.
- `dataset/college_data.csv` — college reference data (average admitted student profile).
- `preprocessing/preprocess.py` — feature loading / scaling helpers.
- `train.py` — trains a model, evaluates it, saves `models/admission_model.pkl` + `models/scaler.pkl`.
- `predict.py` — loads the saved model and predicts for a single student.
- `app.py` — Flask API exposing `GET /health` and `POST /predict`.

## Usage

```bash
pip install -r requirements.txt
python train.py        # train + save model
python app.py          # serve on http://localhost:5001

# Example prediction
curl -X POST http://localhost:5001/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"gre\":320,\"toefl\":110,\"rating\":4,\"sop\":4.5,\"lor\":4.5,\"cgpa\":9.0,\"research\":1}"
```

Response:

```json
{ "chanceOfAdmit": 0.83 }
```
