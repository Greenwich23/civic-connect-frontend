import axiosClient from "./axiosClient";

export const sendContactMessage = ({ name, email, subject, message }) =>
  axiosClient.post("/contact", { name, email, subject, message });
