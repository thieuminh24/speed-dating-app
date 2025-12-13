// components/verification/VerificationButton.tsx (UPDATED)
"use client";

import React, { useEffect, useState } from "react";
import {
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useVerification } from "@/store/verification.store";
import { VerifiedBadge } from "./VerifiedBadge";
import { EnhancedVerificationModal } from "./EnhancedVerificationModal";

export const VerificationButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    isPhotoVerified,
    verificationStatus,
    latestRequest,
    fetchStatus,
    isLoading,
  } = useVerification();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Nếu đã verified
  if (isPhotoVerified) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30 mt-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              Danh tính đã xác thực
            </div>
            <VerifiedBadge size="sm" />
          </div>
        </div>
        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  // Render theo status
  const renderContent = () => {
    switch (verificationStatus) {
      case "pending":
        return (
          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Đang chờ xét duyệt
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chúng tôi sẽ xem xét trong 24-48h
                </p>
              </div>
            </div>
          </div>
        );

      case "rejected":
        return (
          <button
            onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:hover:bg-red-950/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Yêu cầu bị từ chối
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {latestRequest?.rejectionReason || "Nhấn để gửi lại"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        );

      default:
        return (
          <button
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 transition-all hover:shadow-md dark:border-blue-800 dark:from-blue-950/30 dark:to-purple-950/30"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <span>Xác minh danh tính</span>
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tự động so khớp khuôn mặt · Tăng độ tin cậy
                </p>
              </div>
            </div>
            <ChevronRight className="relative h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
          </button>
        );
    }
  };

  return (
    <>
      {renderContent()}
      <EnhancedVerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          fetchStatus();
          setShowModal(false);
        }}
      />
    </>
  );
};
