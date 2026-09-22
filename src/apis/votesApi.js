import axiosClient from "./axiosClient";

export const castVote = (targetType, targetId, value) =>
  axiosClient.post("/votes", { targetType, targetId, value });

export const removeVote = (targetType, targetId) =>
  axiosClient.delete(`/votes/${targetType}/${targetId}`);

export const getVoteStatus = (targetType, targetId) =>
  axiosClient.get(`/votes/${targetType}/${targetId}/status`);
