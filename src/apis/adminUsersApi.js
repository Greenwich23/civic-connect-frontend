import axiosClient from "./axiosClient";

export const getAllUsers = (params) =>
  axiosClient.get("/admin/users", { params });
export const getUserById = (id) => axiosClient.get(`/admin/users/${id}`);
export const deactivateUser = (id) =>
  axiosClient.patch(`/admin/users/${id}/deactivate`);
export const reactivateUser = (id) =>
  axiosClient.patch(`/admin/users/${id}/reactivate`);
