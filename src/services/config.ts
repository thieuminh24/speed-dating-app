// services/config.ts (FIXED)
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
    // ✅ FIX: Chỉ redirect khi 401 VÀ KHÔNG PHẢI login endpoint
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/auth/login");

      // Nếu là login request, để component tự xử lý lỗi
      if (isLoginRequest) {
        return Promise.reject(error);
      }

      // Nếu không phải login, mới logout và redirect
      useAuth.getState().logout();
      if (typeof window !== "undefined") {
        // ✅ FIX: Check xem có đang ở trang admin không
        const isAdminPage = window.location.pathname.startsWith("/admin");
        window.location.href = isAdminPage ? "/admin/login" : "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default userService;
