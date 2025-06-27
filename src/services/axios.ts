import axios from "axios";
import { getAccessTokenFromStorage } from "@/utils/storage";

const baseURL = import.meta.env.VITE_PRODUCTION_SOCKET_URL;

const axiosPublic = axios.create({
  baseURL: `http://${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});

const axiosPrivate = axios.create({
  baseURL: `http://${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor to dynamically add Authorization header
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { axiosPublic, axiosPrivate };
