import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <h1>🎓 Will you get in? Find out in seconds.</h1>
      <p>
        Enter your GRE, TOEFL, CGPA and profile details — our machine-learning model
        predicts your admission chances and recommends the universities that best fit
        your profile.
      </p>
      <Link to="/predictor" className="btn">Start predicting</Link>
      <div className="grid" style={{ marginTop: "2.5rem", textAlign: "left" }}>
        <div className="card">
          <h2>🤖 ML-Powered</h2>
          <p className="subtitle">A trained scikit-learn model estimates your chance of admit.</p>
        </div>
        <div className="card">
          <h2>🏫 Smart Matches</h2>
          <p className="subtitle">Colleges are ranked by how well your profile fits their averages.</p>
        </div>
        <div className="card">
          <h2>📊 History</h2>
          <p className="subtitle">Create an account to save and compare all your predictions.</p>
        </div>
      </div>
    </div>
  );
}
