// src/api.js
// Axios instance configured for cookie-based httpOnly JWT auth (withCredentials: true).
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // make sure backend runs on this host
  withCredentials: true, // include httpOnly cookies automatically
});

// ---------- Google Trends ----------
export const fetchTrends = (payload) =>
  API.post(`/fetch-trends`, payload);  
// payload = { keyword, geo }

export const getTrends = (payload) =>
  API.post(`/trends`, payload);        
// backend should return { keyword, trends, anomalies }

// -------- Reddit --------
export const fetchReddit = (keyword) =>
  API.post(`/fetch-reddit/${keyword}`);

export const analyzeSentiment = () =>
  API.post(`/analyze-reddit-sentiment`);

// -------- Sentiment Insights --------
export const getSentimentInsights = (keyword) =>
  API.get(`/sentiment/${keyword}`);


// ---------- Forecast ----------
export const forecastTrends = (keyword) =>
  API.get(`/forecast-google-trends/${keyword}`);

//--------------Reccommendations ------------
// 1) Batch
export function getRecommendationsBatch(keywords = []) {
  return API.post("/api/recommendations/batch", { keywords });
}

// 2) Single keyword
export function getRecommendation(keyword) {
  return API.get(`/api/recommendations/keyword/${encodeURIComponent(keyword)}`);
}

// 3) List
export function listRecommendations(limit = 50) {
  return API.get(`/api/recommendations?limit=${limit}`);
}

// 4) CSV download
export function downloadRecommendationsCSV(keyword = "") {
  const url = keyword
    ? `/api/recommendations/download?keyword=${encodeURIComponent(keyword)}`
    : `/api/recommendations/download`;

  return API.get(url, { responseType: "blob" });
}


// ---------- AUTH / USER endpoints (cookie-based) ----------
export const apiLogin = (payload) => API.post("/login", payload); // returns {message}
export const apiLogout = () => API.post("/logout"); // backend clears cookie

// Profile endpoints (protected via cookie)
export const apiGetProfile = () => API.get("/user/profile");
export const apiUpdateProfile = (formData) =>
  API.put("/user/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });

// avatar upload (multipart) - backend expects field name "file"
export const apiUploadAvatar = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return API.post("/user/avatar", fd, { headers: { "Content-Type": "multipart/form-data" } });
};

export const apiChangePassword = (payload) =>
  API.post("/user/change-password", payload);

// 2FA
export const api2faSetup = () => API.post("/user/2fa/setup");
export const api2faVerify = (payload) => API.post("/user/2fa/verify", payload);

export default API;

