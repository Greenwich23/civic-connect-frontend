import axiosClient from "./axiosClient";

export const getPublicStats = () => axiosClient.get("/public/stats");
