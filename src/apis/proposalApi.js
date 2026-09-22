import axiosClient from "./axiosClient";

export const getProposals = (issueId) =>
  axiosClient.get(`/issues/${issueId}/proposals`);

export const createProposal = (issueId, data) =>
  axiosClient.post(`/issues/${issueId}/proposals`, data);

export const getProposalById = (id) => axiosClient.get(`/proposals/${id}`);
export const getCommunityProposals = () =>
  axiosClient.get("/proposals/community");
