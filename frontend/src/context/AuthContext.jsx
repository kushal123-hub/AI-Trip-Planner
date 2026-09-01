import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from "../services/authService";
import { isAuthenticated as checkAuth, getToken } from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "register"
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState(null);

  const refreshUser = async () => {
    if (checkAuth()) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        apiLogout();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    await refreshUser();
    return data;
  };

  const register = async (username, email, password) => {
    const data = await apiRegister(username, email, password);
    // After register, automatically log in
    await login(email, password);
    return data;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const openAuthModal = (mode = "login", onSuccess = null) => {
    setAuthModalMode(mode);
    setOnAuthSuccessCallback(() => onSuccess);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setOnAuthSuccessCallback(null);
  };

  const triggerAuthSuccess = () => {
    if (typeof onAuthSuccessCallback === "function") {
      onAuthSuccessCallback();
    }
    closeAuthModal();
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user || checkAuth(),
    login,
    register,
    logout,
    refreshUser,
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    closeAuthModal,
    triggerAuthSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
