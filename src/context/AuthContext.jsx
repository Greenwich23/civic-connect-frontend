/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useState, useEffect } from "react";
import * as authApi from "../apis/authApi";
import * as communityApi from "../apis/communityApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingApplication, setPendingApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser()
      .then(({ data }) => {
        setUser(data.user);
        setPendingApplication(data.pendingApplication);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Doesn't log the user in — the account is unverified until verifyOtp
  // succeeds, so no token exists yet.
  const register = async (formData) => {
    const { data } = await authApi.registerUser(formData);
    return data;
  };

  const verifyOtp = async ({ email, otp }) => {
    const { data } = await authApi.verifyOtp({ email, otp });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await authApi.sendOtp({ email });
    return data;
  };

  const login = async (credentials) => {
    const { data } = await authApi.loginUser(credentials);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logoutUser();
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setPendingApplication(null);
    }
  };

  const refreshUser = async () => {
    const { data } = await authApi.getCurrentUser();
    setUser(data.user);
    setPendingApplication(data.pendingApplication);
  };

  const joinCommunity = async (communityId) => {
    const { data } = await communityApi.joinCommunity(communityId);
    setUser(data.user);
    return data;
  };

  const leaveCommunity = async () => {
    const { data } = await communityApi.leaveCommunity();
    setUser(data.user);
    return data;
  };

  // Directly syncs an already-updated user object into context —
  // used after actions like editing the profile, where the API call
  // itself lives in a separate hook (useUpdateProfile) rather than here.
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    pendingApplication,
    loading,
    isAuthenticated: !!user,
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
    refreshUser,
    joinCommunity,
    leaveCommunity,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
