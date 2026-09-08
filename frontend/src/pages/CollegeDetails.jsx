import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { getCollege } from "../services/collegeApi.js";

export default function CollegeDetails() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCollege(id)
      .then(setCollege)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="form-error">{error}</p>;
  if (!college) return <Loader full />;

  return (
    <div>
      <Link to="/colleges">← Back to colleges</Link>
      <h1 style={{ marginTop: "0.5rem" }}>{college.name}</h1>
      <p className="subtitle">{college.location}</p>
      <div className="card">
        <h2>Snapshot</h2>
        <p>🏆 National ranking: #{college.ranking}</p>
        <p>🎯 Acceptance rate: {Math.round(college.acceptanceRate * 100)}%</p>
        <p>📝 Average GRE: {college.avgGRE} · Average TOEFL: {college.avgTOEFL}</p>
        <p>📚 Average CGPA: {college.avgCGPA} (minimum {college.minCGPA})</p>
        {college.tuition > 0 && <p>💰 Approx. tuition: ${college.tuition.toLocaleString()}/yr</p>}
      </div>
      <div className="card">
        <h2>Popular programs</h2>
        {(college.courses || []).map((c) => <span className="pill" key={c}>{c} </span>)}
      </div>
      {college.website && (
        <a className="btn" href={college.website} target="_blank" rel="noreferrer">
          Visit website
        </a>
      )}
    </div>
  );
}
