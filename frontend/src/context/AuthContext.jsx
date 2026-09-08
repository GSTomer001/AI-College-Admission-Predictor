import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as loginApi, register as registerApi, logout as logoutApi } from "../services/authApi.js";
import { TOKEN_KEY } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists, restore the session.
  useEffect(() => {
    async function restore() {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
