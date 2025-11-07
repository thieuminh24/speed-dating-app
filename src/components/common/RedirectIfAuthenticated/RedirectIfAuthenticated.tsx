// src/components/RedirectIfAuthenticated.tsx
"use client";

import { useAuth } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/animations/Loading";

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/app"); // hoặc "/dashboard", "/home"
    }
  }, [isHydrated, isAuthenticated, router]);

  // Đang hydrate → hiện loading
  if (!isHydrated) {
    return <Loading />;
  }

  // Chưa đăng nhập → hiện trang login/register
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Đã đăng nhập → đang được redirect
  return null;
}
