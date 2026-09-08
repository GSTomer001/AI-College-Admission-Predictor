# AI College Admission Predictor 🎓

A full-stack application that predicts a student's chance of admission to universities and recommends matching colleges using a Machine Learning model.

## Architecture

```
frontend/   -> React.js (Vite) SPA
backend/    -> Node.js + Express REST API (MongoDB via Mongoose)
ai-model/   -> Python + scikit-learn prediction microservice (Flask)
```

### How it works

1. The student fills the **Admission Form** (GRE, TOEFL, CGPA, SOP/LOR ratings, research, etc.).
2. The React app calls the Express API (`POST /api/predictions`).
3. The Express `aiService` forwards the features to the Python Flask service (`POST /predict`).
4. The trained scikit-learn model returns the probability of admission.
5. The `collegeService` matches the student's profile against colleges and returns ranked recommendations.
6. Predictions are saved per-user and shown on the **Results** page and **Dashboard**.

> If the Python AI service is not running, the backend automatically falls back to a built-in heuristic estimator so the app keeps working.

> **No MongoDB installed?** No problem. The backend automatically starts an
> **in-memory MongoDB** (`mongodb-memory-server`) when it cannot reach
> `MONGO_URI`, and auto-seeds the 10-college catalog on first start.
> In-memory data resets when the backend restarts — install MongoDB for persistence.


## Prerequisites

- Node.js >= 18
- Python >= 3.9
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

## Setup

### 1. Install everything

```bash
npm run install:all
```

### 2. Train the AI model

```bash
pip install -r ai-model/requirements.txt
npm run train-model   # creates ai-model/models/admission_model.pkl & scaler.pkl
```

### 3. Configure environment

- `backend/.env` — set `MONGO_URI`, `JWT_SECRET`, `AI_MODEL_URL`
- `frontend/.env` — set `VITE_API_URL` (defaults to `http://localhost:5000`)

### 4. Seed colleges into MongoDB (optional but recommended)

```bash
npm run seed
```

### 5. Run everything (AI service + backend + frontend)

```bash
npm run dev
# or, on Windows (background + status check):
powershell -ExecutionPolicy Bypass -File start-all.ps1
```

| Service  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:5000        |
| AI model | http://localhost:5001        |

## API Overview (backend)

| Method | Route                     | Description                       |
| ------ | ------------------------- | --------------------------------- |
| POST   | `/api/auth/register`      | Register a user                   |
| POST   | `/api/auth/login`         | Login, returns JWT                |
| GET    | `/api/auth/me`            | Current user (protected)          |
| GET    | `/api/colleges`           | List / search colleges            |
| GET    | `/api/colleges/:id`       | College details                   |
| POST   | `/api/predictions`        | Predict admission chance          |
| GET    | `/api/predictions`        | My prediction history             |
| GET    | `/api/users/profile`      | Get profile                       |
| PUT    | `/api/users/profile`      | Update profile                    |
