// src/hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth.store";
import { getSocket } from "@/lib/socket";
import userService from "@/services/config";

export const useAuthInit = () => {
  const { token, user, isReady, login, init } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    if (token && id) {
      userService.get(`/users/${id}`).then((res) => {
        login(token, res.data);
      });
    } else {
      init();
    }
  }, []);

  // Kết nối socket khi có token
  useEffect(() => {
    if (token) getSocket();
  }, [token]);

  return { token, user, isReady };
};
