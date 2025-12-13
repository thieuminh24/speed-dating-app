// components/admin/ReportDetailModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Report, updateReportStatus } from "@/services/admin/admin-report.api";
import { Flag, User, Calendar, FileImage } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ResolveReportModal } from "./ResolveReportModal";

interface ReportDetailModalProps {
  report: Report;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const REPORT_REASONS = {
  scam: "Lừa đảo",
  fake_account: "Tài khoản giả",
  sexual_content: "Nội dung nhạy cảm",
  violence: "Bạo lực",
  spam: "Spam",
  underage: "Chưa đủ tuổi",
  other: "Khác",
};

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  open,
  onClose,
  onUpdate,
}) => {
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleMarkReviewing = async () => {
    setIsLoading(true);
    try {
      await updateReportStatus(report._id, {
        status: "reviewing",
        adminNote: "Đang xem xét báo cáo",
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "text-amber-600 bg-amber-50 border-amber-200",
      reviewing: "text-blue-600 bg-blue-50 border-blue-200",
      resolved: "text-green-600 bg-green-50 border-green-200",
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              Chi tiết báo cáo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-sm font-medium",
                  getStatusColor(report.status),
                )}
              >
                {report.status === "pending" && "Chờ xử lý"}
                {report.status === "reviewing" && "Đang xử lý"}
                {report.status === "resolved" && "Đã xử lý"}
              </span>
              <p className="text-sm text-gray-500">
                {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </p>
            </div>

            {/* Users Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Reporter */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Người báo cáo</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      report.reporterId.photos[0] || "/placeholder-avatar.png"
                    }
                    alt={report.reporterId.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {report.reporterId.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {report.reporterId.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Target User */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-600">
                  <User className="h-4 w-4" />
                  <span>Bị báo cáo</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      report.targetUserId.photos[0] || "/placeholder-avatar.png"
                    }
                    alt={report.targetUserId.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {report.targetUserId.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {report.targetUserId.email}
                    </p>
                    <span className="mt-1 inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      {report.targetUserId.accountStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Lý do báo cáo
                </h4>
                <span className="inline-block rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {REPORT_REASONS[report.reason as keyof typeof REPORT_REASONS]}
                </span>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Mô tả chi tiết
                </h4>
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {report.description}
                </p>
              </div>

              {/* Attached Files */}
              {report.attachedFiles.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Bằng chứng đính kèm
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {report.attachedFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(file)}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700"
                      >
                        <img
                          src={file}
                          alt={`Evidence ${index + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Review */}
            {report.reviewedBy && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-300">
                  Xử lý bởi Admin
                </h4>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                  <p>
                    <strong>Admin:</strong> {report.reviewedBy.name}
                  </p>
                  {report.reviewedAt && (
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      {format(new Date(report.reviewedAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </p>
                  )}
                  {report.adminNote && (
                    <p>
                      <strong>Ghi chú:</strong> {report.adminNote}
                    </p>
                  )}
                  {report.adminAction && (
                    <p>
                      <strong>Hành động:</strong> {report.adminAction}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            {report.status === "pending" && (
              <Button
                variant="outline"
                onClick={handleMarkReviewing}
                disabled={isLoading}
              >
                Đánh dấu đang xử lý
              </Button>
            )}
            {report.status !== "resolved" && (
              <Button onClick={() => setShowResolveModal(true)}>
                Xử lý báo cáo
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl">
            <img
              src={selectedImage}
              alt="Evidence"
              className="w-full rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
        <ResolveReportModal
          report={report}
          open={showResolveModal}
          onClose={() => setShowResolveModal(false)}
          onSuccess={() => {
            setShowResolveModal(false);
            onUpdate();
            onClose();
          }}
        />
      )}
    </>
  );
};
