// components/admin/BanUserModal.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminUser, banUser } from "@/services/admin/admin-user.api";
import { AlertCircle, UserX } from "lucide-react";

interface BanUserModalProps {
  user: AdminUser;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BanUserModal: React.FC<BanUserModalProps> = ({
  user,
  open,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [banType, setBanType] = useState<"permanent" | "temporary">(
    "temporary",
  );
  const [banUntil, setBanUntil] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do khoá");
      return;
    }

    if (banType === "temporary" && !banUntil) {
      setError("Vui lòng chọn thời gian khoá");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await banUser(user._id, {
        reason: reason.trim(),
        banUntil: banType === "permanent" ? undefined : banUntil,
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
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <UserX className="h-5 w-5" />
            Khoá tài khoản
          </DialogTitle>
          <DialogDescription>
            Khoá tài khoản của <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning */}
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              User sẽ bị đăng xuất và không thể đăng nhập lại cho đến khi được
              mở khoá.
            </p>
          </div>

          {/* Ban Type */}
          <div className="space-y-2">
            <Label>Loại khoá</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBanType("temporary")}
                className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                  banType === "temporary"
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/30"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                }`}
              >
                Tạm thời
              </button>
              <button
                onClick={() => setBanType("permanent")}
                className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                  banType === "permanent"
                    ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/30"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                }`}
              >
                Vĩnh viễn
              </button>
            </div>
          </div>

          {/* Ban Until */}
          {banType === "temporary" && (
            <div className="space-y-2">
              <Label htmlFor="banUntil">Khoá đến ngày</Label>
              <Input
                id="banUntil"
                type="datetime-local"
                value={banUntil}
                onChange={(e) => setBanUntil(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do khoá *</Label>
            <Textarea
              id="reason"
              placeholder="Ví dụ: Vi phạm quy định cộng đồng, spam, fake account..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
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
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Đang xử lý..." : "Khoá tài khoản"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
