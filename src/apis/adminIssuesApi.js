import axiosClient from "./axiosClient";

export const getAllIssues = (params) =>
  axiosClient.get("/admin/issues", { params });
export const getIssueById = (id) => axiosClient.get(`/admin/issues/${id}`);
export const updateIssueStatus = (id, data) =>
  axiosClient.patch(`/admin/issues/${id}/status`, data);
export const moderateIssue = (id, data) =>
  axiosClient.patch(`/admin/issues/${id}/moderate`, data);
