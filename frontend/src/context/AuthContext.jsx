import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);

      // Registration successful, but no tokens yet (need OTP verification)
      return { success: true, email: response.email };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);

      // Save tokens
      localStorage.setItem("access_token", response.tokens.access);
      localStorage.setItem("refresh_token", response.tokens.refresh);

      setUser(response.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (uid, token, passwords) => {
    try {
      setError(null);
      await authAPI.resetPassword(uid, token, passwords);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      
      // Update user data in context with the response
      setUser(response.user);
      
      return { success: true, data: response };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
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
