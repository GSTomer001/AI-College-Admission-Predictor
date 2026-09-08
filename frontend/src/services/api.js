import axios from "axios";

/**
 * Shared axios instance for all API calls.
 * - Base URL comes from frontend/.env (VITE_API_URL)
 * - Automatically attaches the JWT from localStorage
 * - Normalizes errors into Error objects with .message and .status
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const TOKEN_KEY = "acap_token";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    const err = new Error(message);
    err.status = error.response?.status;
    // Auto-logout on invalid/expired tokens
    if (err.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
