import axios from "axios";
import { useAuth } from "@/store/auth.store";

const userService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  timeout: 10_000,
});

userService.interceptors.request.use((config) => {
  const { token } = useAuth.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userService.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default userService;
