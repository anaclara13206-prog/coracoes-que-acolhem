import axios from "axios";
import backend from "@/lib/backend";
const api = axios.create({
  baseURL: backend.url,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("coracoes_token");
    if (token)
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
