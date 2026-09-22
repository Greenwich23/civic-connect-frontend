import axiosClient from "./axiosClient";

export const getMyNotifications = () => axiosClient.get("/notifications");
export const markAsRead = (id) =>
  axiosClient.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => axiosClient.patch("/notifications/read-all");
export const deleteNotification = (id) =>
  axiosClient.delete(`/notifications/${id}`);
export const clearAllNotifications = () => axiosClient.delete("/notifications");
