import api from "./api.js";
import { IS_DEMO, demoCreatePrediction, demoGetMyPredictions, demoDeletePrediction } from "./demoEngine.js";

/** Submit a student profile for an admission-chance prediction. */
export async function createPrediction(profile) {
  if (IS_DEMO) return demoCreatePrediction(profile);
  const { data } = await api.post("/predictions", { profile });
  return data;
}

/** Get the signed-in user's prediction history. */
export async function getMyPredictions() {
  if (IS_DEMO) return demoGetMyPredictions();
  const { data } = await api.get("/predictions");
  return data;
}

/** Delete one prediction by id. */
export async function deletePrediction(id) {
  if (IS_DEMO) return demoDeletePrediction(id);
  const { data } = await api.delete(`/predictions/${id}`);
  return data;
}

