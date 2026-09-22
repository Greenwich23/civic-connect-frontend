import axiosClient from "./axiosClient";

export const updateProfile = (formData) =>
  axiosClient.patch("/profile/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
