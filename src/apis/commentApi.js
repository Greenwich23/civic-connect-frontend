import axiosClient from "./axiosClient.js";

/*
=========================================================
COMMENTS
=========================================================
*/

// Get all comments for an issue
export const getComments = async (issueId) => {
  const { data } = await axiosClient.get(`/issues/${issueId}/comments`);
  return data;
};

// Create / post a comment
export const createComment = async (issueId, content) => {
  const { data } = await axiosClient.post(`/issues/${issueId}/comments`, {
    content,
  });

  return data;
};

/*
=========================================================
SINGLE COMMENT
=========================================================
*/

// Get a single comment
export const getCommentById = async (commentId) => {
  const { data } = await axiosClient.get(`/comments/${commentId}`);

  return data;
};

// Update a comment
export const updateComment = async (commentId, content) => {
  const { data } = await axiosClient.put(`/comments/${commentId}`, {
    content,
  });

  return data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const { data } = await axiosClient.delete(`/comments/${commentId}`);

  return data;
};

/*
=========================================================
REPLIES
=========================================================
*/

// Get replies for a comment
export const getCommentReplies = async (commentId) => {
  const { data } = await axiosClient.get(`/comments/${commentId}/replies`);

  return data;
};

// Reply to a comment
export const replyToComment = async (commentId, content) => {
  const { data } = await axiosClient.post(`/comments/${commentId}/replies`, {
    content,
  });

  return data;
};

/*
=========================================================
MODERATION
=========================================================
*/

// Report a comment
export const reportComment = async (commentId, { reason, details } = {}) => {
  const { data } = await axiosClient.post(`/comments/${commentId}/report`, {
    reason,
    details,
  });

  return data;
};

/*
=========================================================
PINNING (representative announcements)
=========================================================
*/

// Pin a comment
export const pinComment = async (commentId) => {
  const { data } = await axiosClient.post(`/comments/${commentId}/pin`);

  return data;
};

// Unpin a comment
export const unpinComment = async (commentId) => {
  const { data } = await axiosClient.delete(`/comments/${commentId}/pin`);

  return data;
};
