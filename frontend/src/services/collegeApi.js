import api from "./api.js";
import { IS_DEMO, demoGetColleges, demoGetCollege, demoMatchColleges } from "./demoEngine.js";

/** List colleges. Supports { q, sort } params. */
export async function getColleges(params = {}) {
  if (IS_DEMO) return demoGetColleges(params);
  const { data } = await api.get("/colleges", { params });
  return data;
}

/** Get a single college by id. */
export async function getCollege(id) {
  if (IS_DEMO) return demoGetCollege(id);
  const { data } = await api.get(`/colleges/${id}`);
  return data;
}

/** POST /colleges/match — ranked college matches for a student profile. */
export async function matchColleges(profile) {
  if (IS_DEMO) return demoMatchColleges(profile, 10);
  const { data } = await api.post("/colleges/match", profile);
  return data;
}

