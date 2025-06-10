// src/api/api.js
import axios from "axios";
import APP_URI from "../config/apiBaseUrl";

const api = axios.create({
  baseURL: APP_URI,
  timeout: 10000,
  withCredentials: true,
});

// Optional: Add token automatically (can be done with interceptors if preferred)
// You can leave this out if you pass token manually per request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // or your getToken() method
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
