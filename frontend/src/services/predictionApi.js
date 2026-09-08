import api from "./api.js";

/** Submit a student profile for an admission-chance prediction. */
export async function createPrediction(profile) {
  const { data } = await api.post("/predictions", { profile });
  return data;
}

/** Get the signed-in user's prediction history. */
export async function getMyPredictions() {
  const { data } = await api.get("/predictions");
  return data;
}

/** Delete one prediction by id. */
export async function deletePrediction(id) {
  const { data } = await api.delete(`/predictions/${id}`);
  return data;
}
