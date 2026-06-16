import React, { useState, useEffect, useCallback, useRef } from "react";
import { AuthContext } from "./authContext";
import apiClient, { refreshAccessToken } from "../api/axiosClient";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const restoreStarted = useRef(false);

  const restoreSession = useCallback(async () => {
    const checkStorage = () => localStorage.getItem("user") || sessionStorage.getItem("user");
    
    if (restoreStarted.current) return;
    restoreStarted.current = true;

    try {
      setLoading(true);
      const storedUser = checkStorage();
      
      if (!storedUser) {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const { user: freshUser } = await refreshAccessToken();
        
        const finalUser = freshUser || JSON.parse(storedUser);
        sessionStorage.setItem("user", JSON.stringify(finalUser));
        localStorage.setItem("user", JSON.stringify(finalUser));
        
        setUser(finalUser);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Session restoration failed:", err.response?.data?.message || err.message);
        setUser(null);
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/users/login", { email, password });
      const { user, accessToken } = response.data.data;

      // Save to BOTH storage types for maximum redundancy
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("accessToken", accessToken);

      setUser(user);
      setIsLoggedIn(true);
      return response.data.data;
    } catch (error) {
      console.error("AuthProvider: Login failed:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/users/logout");
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    setUser,
    setIsLoggedIn,
    refreshUser: restoreSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
