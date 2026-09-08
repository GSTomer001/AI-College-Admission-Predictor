import { useCallback, useState } from "react";
import { createPrediction } from "../services/predictionApi.js";
import { matchColleges } from "../services/collegeApi.js";

/**
 * Encapsulates the prediction flow:
 * submit profile -> admission chance + ranked college matches.
 */
export default function usePrediction() {
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (profile) => {
    setLoading(true);
    setError(null);
    try {
      const prediction = await createPrediction(profile);
      setResult(prediction);
      // College matches are also embedded in the prediction; refresh ranked
      // matches separately so the UI stays correct even if it fails.
      matchColleges(profile)
        .then(setMatches)
        .catch(() => setMatches(prediction.matchedColleges || []));
      return prediction;
    } catch (err) {
      setError(err.message);
      setResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setMatches([]);
    setError(null);
  }, []);

  return { result, matches, loading, error, predict, reset };
}
