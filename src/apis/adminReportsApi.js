import axiosClient from "./axiosClient";

export const getReports = (status) =>
  axiosClient.get("/admin/representative-reports", {
    params: status ? { status } : undefined,
  });

export const getReportById = (id) =>
  axiosClient.get(`/admin/representative-reports/${id}`);

export const reviewReport = (id, data) =>
  axiosClient.patch(`/admin/representative-reports/${id}/review`, data);
