import api from "./api.js";

/** List colleges. Supports { q, sort } params. */
export async function getColleges(params = {}) {
  const { data } = await api.get("/colleges", { params });
  return data;
}

/** Get a single college by id. */
export async function getCollege(id) {
  const { data } = await api.get(`/colleges/${id}`);
  return data;
}

/** POST /colleges/match — ranked college matches for a student profile. */
export async function matchColleges(profile) {
  const { data } = await api.post("/colleges/match", profile);
  return data;
}
