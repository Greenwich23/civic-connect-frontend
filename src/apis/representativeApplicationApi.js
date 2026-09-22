// apis/representativeApplicationApi.js
import axiosClient from "./axiosClient";

export const applyForRepresentative = (formData) =>
  axiosClient.post("/representative-applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyApplication = () =>
  axiosClient.get("/representative-applications/mine");
