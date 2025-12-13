// app/admin/verifications/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getPendingVerifications,
  PendingVerification,
} from "@/services/verification/verification.api";
import { Clock, Shield, LogOut, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth.store";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { VerificationDetailModal } from "./components/VerificationDetailModal";

export default function AdminVerificationsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Check admin role
    if (!user || user.role !== "admin") {
      router.push("/admin/login");
      return;
    }

    fetchVerifications();
  }, [user, router]);

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingVerifications();
      setVerifications(data);
    } catch (error) {
      console.error("Failed to fetch verifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const handleReviewComplete = () => {
    setSelectedId(null);
    fetchVerifications(); // Refresh list
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Xác thực người dùng
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chờ duyệt
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {verifications.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đã duyệt
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  -
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Từ chối
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  -
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Yêu cầu chờ xét duyệt ({verifications.length})
          </h2>

          {verifications.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Không có yêu cầu nào đang chờ
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {verifications.map((verification) => (
                <button
                  key={verification._id}
                  onClick={() => setSelectedId(verification._id)}
                  className="flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
                >
                  {/* User Avatar */}
                  <img
                    src={
                      verification.userId.photos[0] || "/placeholder-avatar.png"
                    }
                    alt={verification.userId.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {verification.userId.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {verification.userId.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {formatDistanceToNow(new Date(verification.submittedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <Clock size={14} />
                    <span>Chờ duyệt</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedId && (
        <VerificationDetailModal
          verificationId={selectedId}
          open={!!selectedId}
          onClose={() => setSelectedId(null)}
          onReviewComplete={handleReviewComplete}
        />
      )}
    </div>
  );
}
