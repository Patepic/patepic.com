import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(
    () => localStorage.getItem("patepic_token") || null,
  );

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    import("../lib/api").then(({ fetchMe }) =>
      fetchMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("patepic_token");
          setToken(null);
          setUser(null);
        })
    );
  }, [token]);

  const login = useCallback(async (email, password) => {
    const { login: apiLogin } = await import("../lib/api");
    const data = await apiLogin(email, password);
    localStorage.setItem("patepic_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("patepic_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
