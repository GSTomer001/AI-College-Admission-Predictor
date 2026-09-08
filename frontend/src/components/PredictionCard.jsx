import ProbabilityBar from "./ProbabilityBar.jsx";

/** Displays the predicted admission chance returned by the API. */
export default function PredictionCard({ result }) {
  if (!result) return null;

  const pct = Math.round(result.chanceOfAdmit * 100);
  const verdict =
    pct >= 70 ? "Strong chances! 🎉" : pct >= 40 ? "Moderate chances 👍" : "Reach — improve your profile 📈";

  return (
    <div className="card">
      <h2>Your admission prediction</h2>
      <p style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--primary)" }}>
        {pct}%
      </p>
      <ProbabilityBar value={result.chanceOfAdmit} />
      <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
        {verdict} · computed via {result.source === "model" ? "ML model" : "heuristic fallback"}
      </p>
    </div>
  );
}
