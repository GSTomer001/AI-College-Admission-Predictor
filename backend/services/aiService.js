/**
 * Talks to the Python AI microservice (Flask) to get admission chances.
 * Falls back to a simple weighted heuristic when the service is unavailable,
 * so the app keeps working without the ML model running.
 */
const config = require("../config/config");

const FEATURES = ["gre", "toefl", "rating", "sop", "lor", "cgpa", "research"];

async function predictWithModel(profile) {
  try {
    const res = await fetch(`${config.aiModelUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.chanceOfAdmit !== "number") return null;
    return { chanceOfAdmit: data.chanceOfAdmit, source: "model" };
  } catch {
    return null;
  }
}

/** Weighted-score fallback estimator (mirrors the synthetic data generator). */
function heuristicPredict(profile) {
  const score =
    ((profile.gre - 290) / 50) * 0.3 +
    ((profile.toefl - 90) / 30) * 0.15 +
    ((profile.rating - 1) / 4) * 0.1 +
    ((profile.sop - 1) / 4) * 0.1 +
    ((profile.lor - 1) / 4) * 0.1 +
    ((profile.cgpa - 6) / 4) * 0.2 +
    profile.research * 0.05;
  return {
    chanceOfAdmit: Math.round(Math.min(Math.max(score, 0.02), 0.98) * 1000) / 1000,
    source: "heuristic",
  };
}

async function getAdmissionChance(profile) {
  const missing = FEATURES.filter((f) => profile[f] === undefined || profile[f] === null);
  if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
  FEATURES.forEach((f) => {
    profile[f] = Number(profile[f]);
  });

  const viaModel = await predictWithModel(profile);
  return viaModel || heuristicPredict(profile);
}

async function isAiServiceHealthy() {
  try {
    const res = await fetch(`${config.aiModelUrl}/health`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

module.exports = { getAdmissionChance, heuristicPredict, isAiServiceHealthy, FEATURES };
