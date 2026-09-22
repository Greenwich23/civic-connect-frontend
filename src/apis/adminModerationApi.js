import axiosClient from "./axiosClient";

export const getFlaggedComments = (params) =>
  axiosClient.get("/admin/moderation/comments/flagged", { params });
export const moderateComment = (id, data) =>
  axiosClient.patch(`/admin/moderation/comments/${id}`, data);
