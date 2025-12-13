// components/admin/RestrictUserModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminUser, restrictUser } from "@/services/admin/admin-user.api";
import { ShieldAlert, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestrictUserModalProps {
  user: AdminUser;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DURATION_OPTIONS = [
  { label: "3 ngày", value: 3 },
  { label: "7 ngày", value: 7 },
  { label: "14 ngày", value: 14 },
  { label: "30 ngày", value: 30 },
];

const FEATURE_OPTIONS = [
  { id: "like", label: "Like/Super Like" },
  { id: "message", label: "Nhắn tin" },
  { id: "match", label: "Match mới" },
];

export const RestrictUserModal: React.FC<RestrictUserModalProps> = ({
  user,
  open,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(7);
  const [features, setFeatures] = useState<string[]>(["message"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId],
    );
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do hạn chế");
      return;
    }

    if (features.length === 0) {
      setError("Vui lòng chọn ít nhất một tính năng bị hạn chế");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await restrictUser(user._id, {
        reason: reason.trim(),
        days,
        features,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <ShieldAlert className="h-5 w-5" />
            Hạn chế tài khoản
          </DialogTitle>
          <DialogDescription>
            Hạn chế tính năng của <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning */}
          <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              User vẫn có thể đăng nhập nhưng không sử dụng được các tính năng
              đã chọn.
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Thời gian hạn chế</Label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDays(option.value)}
                  className={cn(
                    "rounded-lg border p-2 text-sm font-medium transition-colors",
                    days === option.value
                      ? "border-orange-600 bg-orange-50 text-orange-700 dark:bg-orange-950/30"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Tính năng bị hạn chế *</Label>
            <div className="space-y-2">
              {FEATURE_OPTIONS.map((feature) => (
                <label
                  key={feature.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={features.includes(feature.id)}
                    onChange={() => toggleFeature(feature.id)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {feature.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do hạn chế *</Label>
            <Textarea
              id="reason"
              placeholder="Ví dụ: Spam tin nhắn, hành vi không phù hợp..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Huỷ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? "Đang xử lý..." : "Hạn chế"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
