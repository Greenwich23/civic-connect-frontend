import axiosClient from "./axiosClient";

export const getPendingApplications = () =>
  axiosClient.get("/admin/representative-applications");
export const getApplicationById = (id) =>
  axiosClient.get(`/admin/representative-applications/${id}`);
export const reviewApplication = (id, data) =>
  axiosClient.patch(`/admin/representative-applications/${id}/review`, data);
