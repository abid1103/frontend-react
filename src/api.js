// src/api.js
// Axios instance configured for cookie-based httpOnly JWT auth (withCredentials: true).
import axios from "axios";

const API = axios.create({
  baseURL: "", // make sure backend runs on this host
  withCredentials: true, // include httpOnly cookies automatically
});
// Google Trends
export const fetchTrends = (payload) =>
  API.post("/api/fetch-trends", payload);

export const getTrends = (payload) =>
  API.post("/api/trends", payload);

// Reddit
export const fetchReddit = (keyword) =>
  API.post(`/api/fetch-reddit/${keyword}`);

export const analyzeSentiment = () =>
  API.post("/api/analyze-reddit-sentiment");

// Sentiment
export const getSentimentInsights = (keyword) =>
  API.get(`/api/sentiment/${keyword}`);

// Forecast
export const forecastTrends = (keyword) =>
  API.get(`/api/forecast-google-trends/${keyword}`);

// AUTH
export const apiLogin = (payload) => API.post("/api/login", payload);
export const apiLogout = () => API.post("/api/logout");

// User
export const apiGetProfile = () => API.get("/api/user/profile");
export const apiUpdateProfile = (formData) =>
  API.put("/api/user/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const apiUploadAvatar = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return API.post("/api/user/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const apiChangePassword = (payload) =>
  API.post("/api/user/change-password", payload);

// 2FA
export const api2faSetup = () => API.post("/api/user/2fa/setup");
export const api2faVerify = (payload) => API.post("/api/user/2fa/verify", payload);

export default API;

