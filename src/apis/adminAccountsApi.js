import axiosClient from "./axiosClient";

// Managing the "admin" tier itself — super_admin only. Kept separate from
// adminUsersApi.js (citizens/representatives), matching the backend split.
export const getAllAdmins = (params) =>
  axiosClient.get("/admin/admins", { params });
export const createAdmin = (data) => axiosClient.post("/admin/admins", data);
export const deactivateAdmin = (id) =>
  axiosClient.patch(`/admin/admins/${id}/deactivate`);
export const reactivateAdmin = (id) =>
  axiosClient.patch(`/admin/admins/${id}/reactivate`);
