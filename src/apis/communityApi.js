import axiosClient from "./axiosClient";

export const getAllCommunities = (params) =>
  axiosClient.get("/communities", { params });
export const getJoinableCommunities = () =>
  axiosClient.get("/communities/joinable");
export const getCommunityById = (id) => axiosClient.get(`/communities/${id}`);
export const checkCommunityNameExists = (name) =>
  axiosClient.get("/communities/check", { params: { name } });

export const joinCommunity = (communityId) =>
  axiosClient.patch("/communities/join", { communityId });
export const leaveCommunity = () => axiosClient.patch("/communities/leave");
