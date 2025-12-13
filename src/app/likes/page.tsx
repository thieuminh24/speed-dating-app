"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import Layout from "@/components/layout";
import AuthGuard from "@/components/common/AuthGuard/AuthGuard";
import { LikesReceived } from "./components/LikesReceived";

export default function LikesPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <Layout
        asideChildren={
          <div className="w-full space-y-4">
            <div className="text-center">
              <h3 className="font-bold text-lg">Premium Features</h3>
              <p className="text-sm text-gray-600">Xem ai đã thích bạn</p>
            </div>
          </div>
        }
        mainChildren={<LikesReceived />}
      />
    </AuthGuard>
  );
}
