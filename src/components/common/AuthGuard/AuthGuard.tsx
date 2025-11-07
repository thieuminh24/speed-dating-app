// src/components/AuthGuard.tsx
"use client";

import { useAuth } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/animations/Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isHydrated, isAuthenticated } = useAuth();
  const router = useRouter();

  // LOG ĐỂ DEBUG (xóa khi production)
  console.log("AuthGuard:", { token: !!token, isHydrated, isAuthenticated });

  // CHỈ REDIRECT KHI ĐÃ HYDRATE XONG
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  // ĐANG ĐỌC localStorage → HIỆN LOADING
  if (!isHydrated) {
    return <Loading />;
  }

  // ĐÃ HYDRATE NHƯNG KHÔNG CÓ TOKEN → ĐANG ĐƯỢC REDIRECT
  if (!isAuthenticated) {
    return null;
  }

  // ĐÃ ĐĂNG NHẬP → VÀO APP
  return <>{children}</>;
}
