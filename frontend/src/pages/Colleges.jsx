import { useEffect, useState } from "react";
import CollegeCard from "../components/CollegeCard.jsx";
import Loader from "../components/Loader.jsx";
import { getColleges } from "../services/collegeApi.js";

export default function Colleges() {
  const [colleges, setColleges] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      getColleges(query ? { q: query } : {})
        .then(setColleges)
        .catch((err) => setError(err.message));
    }, 300); // debounce search
    return () => clearTimeout(t);
  }, [query]);

  if (error) return <p className="form-error">{error}</p>;

  return (
    <div>
      <h1>Explore colleges</h1>
      <p className="subtitle">Search universities and see their admitted-student averages.</p>
      <div className="form-group" style={{ maxWidth: 380, marginBottom: "1rem" }}>
        <label htmlFor="search">Search</label>
        <input
          id="search"
          placeholder="Search by name or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {!colleges ? (
        <Loader full />
      ) : colleges.length === 0 ? (
        <p className="subtitle">No colleges found.</p>
      ) : (
        <div className="grid">
          {colleges.map((c) => <CollegeCard key={c._id} college={c} />)}
        </div>
      )}
    </div>
  );
}
