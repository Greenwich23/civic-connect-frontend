import axiosClient from "./axiosClient";

export const getAllCommunities = (params) =>
  axiosClient.get("/admin/communities", { params });
export const getCommunityById = (id, params) =>
  axiosClient.get(`/admin/communities/${id}`, { params });
export const createCommunity = (data) =>
  axiosClient.post("/admin/communities", data);
export const updateCommunity = (id, data) =>
  axiosClient.patch(`/admin/communities/${id}`, data);
