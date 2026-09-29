import axiosClient from "./axiosClient";

export const startConversation = () =>
  axiosClient.post("/messages/conversations");

export const getMyConversations = () =>
  axiosClient.get("/messages/conversations");

export const getConversationMessages = (conversationId) =>
  axiosClient.get(`/messages/conversations/${conversationId}`);

export const sendMessage = (conversationId, content) =>
  axiosClient.post(`/messages/conversations/${conversationId}`, { content });

export const reportMessage = (messageId, { reason, details } = {}) =>
  axiosClient.post(`/messages/${messageId}/report`, { reason, details });
