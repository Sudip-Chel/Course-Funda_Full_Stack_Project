import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Keep state synced on mount (optional)
  useEffect(() => {
    setUser(() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    });
    setToken(localStorage.getItem("token"));
  }, []);

  const login = (userObj, tokenString) => {
    setUser(userObj);
    setToken(tokenString);
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("token", tokenString);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
