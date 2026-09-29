// apis/representativeReportApi.js
import axiosClient from "./axiosClient";

export const reportRepresentative = (payload) =>
  axiosClient.post("/representative-reports", payload);

export const getMyReports = () =>
  axiosClient.get("/representative-reports/mine");
