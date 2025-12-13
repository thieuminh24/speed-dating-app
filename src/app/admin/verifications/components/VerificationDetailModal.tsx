// components/admin/VerificationDetailModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getVerificationDetail,
  reviewVerification,
  VerificationDetail,
} from "@/services/verification/verification.api";
import {
  CheckCircle,
  XCircle,
  Loader2,
  User,
  CreditCard,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface VerificationDetailModalProps {
  verificationId: string;
  open: boolean;
  onClose: () => void;
  onReviewComplete: () => void;
}

export const VerificationDetailModal: React.FC<
  VerificationDetailModalProps
> = ({ verificationId, open, onClose, onReviewComplete }) => {
  const [verification, setVerification] = useState<VerificationDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDetail();
    }
  }, [open, verificationId]);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const data = await getVerificationDetail(verificationId);
      setVerification(data);
    } catch (error) {
      console.error("Failed to fetch verification detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!verification) return;

    setIsReviewing(true);
    try {
      await reviewVerification(verification._id, { status: "approved" });
      onReviewComplete();
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleReject = async () => {
    if (!verification || !rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    setIsReviewing(true);
    try {
      await reviewVerification(verification._id, {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });
      onReviewComplete();
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setIsReviewing(false);
    }
  };

  if (isLoading || !verification) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết xác thực</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <img
                src={verification.userId.photos[0] || "/placeholder-avatar.png"}
                alt={verification.userId.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {verification.userId.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {verification.userId.email}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Gửi lúc:{" "}
                  {format(
                    new Date(verification.submittedAt),
                    "dd/MM/yyyy HH:mm",
                    {
                      locale: vi,
                    },
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Selfie */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Camera size={16} />
                <span>Ảnh Selfie</span>
              </div>
              <img
                src={verification.selfieUrl}
                alt="Selfie"
                className="aspect-[3/4] w-full rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />
            </div>

            {/* ID Card Front */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <CreditCard size={16} />
                <span>CCCD Mặt Trước</span>
              </div>
              <img
                src={verification.idCardUrls[0]}
                alt="ID Card Front"
                className="aspect-[3/4] w-full rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />
            </div>

            {/* ID Card Back */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <CreditCard size={16} />
                <span>CCCD Mặt Sau</span>
              </div>
              <img
                src={verification.idCardUrls[1]}
                alt="ID Card Back"
                className="aspect-[3/4] w-full rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />
            </div>
          </div>

          {/* Reject Form */}
          {showRejectForm && (
            <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
              <Label htmlFor="reason">Lý do từ chối *</Label>
              <Textarea
                id="reason"
                placeholder="Ví dụ: Ảnh selfie không rõ mặt, CCCD bị mờ..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            {!showRejectForm ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  disabled={isReviewing}
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Từ chối
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isReviewing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isReviewing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Phê duyệt
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason("");
                  }}
                  disabled={isReviewing}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isReviewing || !rejectionReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isReviewing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Xác nhận từ chối
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
