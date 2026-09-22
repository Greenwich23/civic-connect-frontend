import axiosClient from "./axiosClient";

export const getPlatformOverview = () =>
  axiosClient.get("/admin/stats/overview");
export const getCommunityBreakdown = () =>
  axiosClient.get("/admin/stats/communities");
