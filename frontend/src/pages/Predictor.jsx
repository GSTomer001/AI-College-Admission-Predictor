import { useNavigate } from "react-router-dom";
import AdmissionForm from "../components/AdmissionForm.jsx";
import PredictionCard from "../components/PredictionCard.jsx";
import ResultTable from "../components/ResultTable.jsx";
import Loader from "../components/Loader.jsx";
import usePrediction from "../hooks/usePrediction.js";

export default function Predictor() {
  const { result, matches, loading, error, predict } = usePrediction();
  const navigate = useNavigate();

  const matchColumns = [
    { key: "name", header: "College" },
    { key: "fitScore", header: "Fit score", render: (r) => `${r.fitScore}/100` },
  ];

  return (
    <div>
      <h1>Admission Predictor</h1>
      <p className="subtitle">Fill in your profile and get your predicted admission chance.</p>

      <AdmissionForm onValid={predict} loading={loading} />
      {error && <p className="form-error">{error}</p>}
      {loading && <Loader full />}

      {result && (
        <>
          <PredictionCard result={result} />
          <h2>Colleges that match your profile</h2>
          <ResultTable columns={matchColumns} rows={matches} emptyMessage="No college matches yet." />
          <button
            className="btn"
            onClick={() => navigate(`/results/${result._id}`)}
            disabled={!result._id}
          >
            View full results →
          </button>
        </>
      )}
    </div>
  );
}
