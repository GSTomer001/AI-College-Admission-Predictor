import { Link } from "react-router-dom";

/** Compact college summary card used in grids/lists. */
export default function CollegeCard({ college }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: "0.25rem" }}>{college.name}</h2>
      <p className="subtitle" style={{ marginBottom: "0.5rem" }}>{college.location}</p>
      <p>
        <span className="pill">#{college.ranking} ranked</span>{" "}
        <span className="pill">{Math.round(college.acceptanceRate * 100)}% accept</span>{" "}
        <span className="pill">avg CGPA {college.avgCGPA}</span>
      </p>
      <br />
      <Link className="btn btn-outline" to={`/colleges/${college._id}`}>
        View details
      </Link>
    </div>
  );
}
