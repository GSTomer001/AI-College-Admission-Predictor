import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PredictionCard from "../components/PredictionCard.jsx";
import ResultTable from "../components/ResultTable.jsx";
import Loader from "../components/Loader.jsx";
import { getMyPredictions } from "../services/predictionApi.js";

/** Shows a saved prediction (by :id) or the latest one, plus history. */
export default function Results() {
  const { id } = useParams();
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyPredictions()
      .then(setPredictions)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="form-error">{error}</p>;
  if (!predictions) return <Loader full />;

  const selected =
    predictions.find((p) => p._id === id) || predictions[0] || null;

  const historyColumns = [
    {
      key: "createdAt",
      header: "Date",
      render: (r) => new Date(r.createdAt).toLocaleString(),
    },
    { key: "cgpa", header: "CGPA", render: (r) => r.profile?.cgpa ?? "—" },
    { key: "gre", header: "GRE", render: (r) => r.profile?.gre ?? "—" },
    {
      key: "chanceOfAdmit",
      header: "Chance",
      render: (r) => `${Math.round((r.chanceOfAdmit || 0) * 100)}%`,
    },
  ];

  return (
    <div>
      <h1>Your results</h1>
      {selected ? (
        <>
          <PredictionCard result={selected} />
          <h2>Matched colleges</h2>
          <ResultTable
            columns={[
              { key: "name", header: "College" },
              { key: "fitScore", header: "Fit score", render: (r) => `${r.fitScore}/100` },
            ]}
            rows={selected.matchedColleges || []}
            emptyMessage="No matches stored for this prediction."
          />
        </>
      ) : (
        <p className="subtitle">No predictions yet — head to the Predictor page.</p>
      )}

      <h2>Prediction history</h2>
      <ResultTable columns={historyColumns} rows={predictions} />
    </div>
  );
}
