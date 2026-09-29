import axiosClient from "./axiosClient";

export const getRepresentativePerformance = () =>
  axiosClient.get("/admin/representative-performance");

export const getRepresentativeResolvedIssues = (userId) =>
  axiosClient.get(`/admin/representative-performance/${userId}/issues`);
