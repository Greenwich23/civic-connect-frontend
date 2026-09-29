import axiosClient from "./axiosClient";

export const submitFeedback = (issueId, formData) =>
  axiosClient.post(`/issues/${issueId}/resolution`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getResolutionStats = (issueId) =>
  axiosClient.get(`/issues/${issueId}/resolution`);

export const getMyFeedback = (issueId) =>
  axiosClient.get(`/issues/${issueId}/resolution/mine`);
