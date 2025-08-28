// src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin"));
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    setAdmin(() => {
      try {
        return JSON.parse(localStorage.getItem("admin"));
      } catch {
        return null;
      }
    });
    setToken(localStorage.getItem("adminToken"));
  }, []);

  const login = (adminObj, tokenString) => {
    setAdmin(adminObj);
    setToken(tokenString);
    localStorage.setItem("admin", JSON.stringify(adminObj));
    localStorage.setItem("adminToken", tokenString);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
