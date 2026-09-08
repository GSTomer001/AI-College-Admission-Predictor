import api, { TOKEN_KEY } from "./api.js";

/** Register a new account. Returns { _id, name, email, token }. */
export async function register({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

/** Login with email/password. Returns { _id, name, email, token }. */
export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

/** Fetch the currently authenticated user (requires token). */
export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

/** Clear the stored token (logout). */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Fetch full profile (user + student record). */
export async function getProfile() {
  const { data } = await api.get("/users/profile");
  return data;
}

/** Update profile. Accepts { name, student: {...} }. */
export async function updateProfile(payload) {
  const { data } = await api.put("/users/profile", payload);
  return data;
}
