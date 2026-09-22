import axiosClient from "./axiosClient";

export const getAllIssues = (params) => axiosClient.get("/issues", { params });
export const getIssueById = (id) => axiosClient.get(`/issues/${id}`);
export const getComments = (issueId) =>
  axiosClient.get(`/issues/${issueId}/comments`);
export const getProposals = (issueId) =>
  axiosClient.get(`/issues/${issueId}/proposals`);

// export const castVote = (targetType, targetId, value) =>
//   axiosClient.post("/votes", { targetType, targetId, value });
// export const getVoteStatus = (targetType, targetId) =>
//   axiosClient.get(`/votes/${targetType}/${targetId}/status`);
export const createIssue = (formData) =>
  axiosClient.post("/issues", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getTrendingIssues = async (communityId) => {
  const { data } = await axiosClient.get("/issues/trending", {
    params: {
      community: communityId,
      limit: 6,
    },
  });

  return data;
};
export const getMyIssues = async () => {
  const { data } = await axiosClient.get("/issues/mine");
  return data;
};
export const saveIssue = (issueId) =>
  axiosClient.post(`/issues/${issueId}/save`);
export const unsaveIssue = (issueId) =>
  axiosClient.delete(`/issues/${issueId}/save`);
export const getSavedIssues = () => axiosClient.get("/issues/saved");
export const updateIssueStatus = (issueId, data) =>
  axiosClient.patch(`/issues/${issueId}/status`, data);
