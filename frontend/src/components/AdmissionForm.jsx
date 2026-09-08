import { useState } from "react";
import { ADMISSION_RANGES, validateAdmissionProfile } from "../utils/validation.js";

const EMPTY = {
  gre: "",
  toefl: "",
  rating: 3,
  sop: 3,
  lor: 3,
  cgpa: "",
  research: 0,
  fieldOfStudy: "Computer Science",
};

const FIELDS = [
  ["Computer Science", "Data Science", "Electrical Engineering", "Mechanical Engineering", "Business Analytics", "Other"],
];

/**
 * Controlled form collecting the student profile sent to the prediction API.
 * Calls onValid(profile) after client-side validation passes.
 */
export default function AdmissionForm({ onValid, loading }) {
  const [profile, setProfile] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateAdmissionProfile(profile);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // Send numbers, not strings
    const cleaned = { ...profile, research: Number(profile.research) };
    for (const key of Object.keys(ADMISSION_RANGES)) {
      cleaned[key] = Number(cleaned[key]);
    }
    onValid(cleaned);
  };

  const numericField = (name, label, step = 1) => {
    const { min, max } = ADMISSION_RANGES[name];
    return (
      <div className="form-group">
        <label htmlFor={name}>{label} ({min}-{max})</label>
        <input
          id={name}
          name={name}
          type="number"
          step={step}
          min={min}
          max={max}
          value={profile[name]}
          onChange={handleChange}
          required
        />
        {errors[name] && <span className="field-error">{errors[name]}</span>}
      </div>
    );
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>Enter your academic profile</h2>
      <div className="form-grid">
        {numericField("gre", "GRE Score", 1)}
        {numericField("toefl", "TOEFL Score", 1)}
        {numericField("cgpa", "CGPA (out of 10)", 0.01)}
        <div className="form-group">
          <label htmlFor="rating">University Rating</label>
          <select id="rating" name="rating" value={profile.rating} onChange={handleChange}>
            {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r} ★</option>)}
          </select>
        </div>
        {numericField("sop", "SOP Strength", 0.5)}
        {numericField("lor", "LOR Strength", 0.5)}
        <div className="form-group">
          <label htmlFor="research">Research Experience</label>
          <select id="research" name="research" value={profile.research} onChange={handleChange}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fieldOfStudy">Field of Study</label>
          <select id="fieldOfStudy" name="fieldOfStudy" value={profile.fieldOfStudy} onChange={handleChange}>
            {FIELDS[0].map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <br />
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Predicting…" : "Predict my admission chance"}
      </button>
    </form>
  );
}
