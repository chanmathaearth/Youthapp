import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE;

const axiosInstance = axios.create({
  baseURL: apiBase,
});

// interceptor แนบ token ทุก request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
