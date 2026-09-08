import api, { TOKEN_KEY } from "./api.js";
import { IS_DEMO, demoRegister, demoLogin, demoGetMe, demoLogout, demoGetProfile, demoUpdateProfile } from "./demoEngine.js";

/** Register a new account. Returns { _id, name, email, token }. */
export async function register({ name, email, password }) {
  if (IS_DEMO) return demoRegister({ name, email, password });
  const { data } = await api.post("/auth/register", { name, email, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

/** Login with email/password. Returns { _id, name, email, token }. */
export async function login({ email, password }) {
  if (IS_DEMO) return demoLogin({ email, password });
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

/** Fetch the currently authenticated user (requires token). */
export async function getMe() {
  if (IS_DEMO) return demoGetMe();
  const { data } = await api.get("/auth/me");
  return data;
}

/** Clear the stored token (logout). */
export function logout() {
  if (IS_DEMO) return demoLogout();
  localStorage.removeItem(TOKEN_KEY);
}

/** Fetch full profile (user + student record). */
export async function getProfile() {
  if (IS_DEMO) return demoGetProfile();
  const { data } = await api.get("/users/profile");
  return data;
}

/** Update profile. Accepts { name, student: {...} }. */
export async function updateProfile(payload) {
  if (IS_DEMO) return demoUpdateProfile(payload);
  const { data } = await api.put("/users/profile", payload);
  return data;
}

