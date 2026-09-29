import axiosClient from "./axiosClient";

export const getFlaggedComments = (params) =>
  axiosClient.get("/admin/moderation/comments/flagged", { params });
export const moderateComment = (id, data) =>
  axiosClient.patch(`/admin/moderation/comments/${id}`, data);

export const getFlaggedMessages = (params) =>
  axiosClient.get("/admin/moderation/messages/flagged", { params });
export const moderateMessage = (id, data) =>
  axiosClient.patch(`/admin/moderation/messages/${id}`, data);
