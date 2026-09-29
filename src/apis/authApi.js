import axiosClient from "./axiosClient";

export const registerUser = (data) => axiosClient.post("/auth/register", data);
export const verifyOtp = (data) => axiosClient.post("/auth/verify-otp", data);
export const sendOtp = (data) => axiosClient.post("/auth/send-otp", data);
export const loginUser = (data) => axiosClient.post("/auth/login", data);
export const logoutUser = () => axiosClient.post("/auth/logout");
export const getCurrentUser = () => axiosClient.get("/auth/me");
export const updatePassword = (data) =>
  axiosClient.patch("/auth/password", data);
