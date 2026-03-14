import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE;

const axiosInstance = axios.create({
  baseURL: apiBase,
});

// interceptor แนบ token ทุก request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  // ยกเว้นเส้นสำหรับผู้ปกครองผ่าน LINE ที่ใช้ line_user_id แทน JWT
  const isLineParentApi = 
    config.url?.includes("line-bot/api/v1/get-child-info") ||
    config.url?.includes("line-bot/api/v1/get-health-records") ||
    config.url?.includes("line-bot/api/v1/get-submissions");

  if (token && !isLineParentApi) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
