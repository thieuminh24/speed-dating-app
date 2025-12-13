// components/admin/ResolveReportModal.tsx
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Report, resolveReport } from "@/services/admin/admin-report.api";
import { AlertTriangle, ShieldAlert, UserX, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResolveReportModalProps {
  report: Report;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ActionType = "warning" | "restricted" | "banned" | "no_action";

const ACTIONS = [
  {
    id: "warning" as ActionType,
    label: "Cảnh cáo",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-600",
    description: "Gửi cảnh cáo, không hạn chế tính năng",
  },
  {
    id: "restricted" as ActionType,
    label: "Hạn chế",
    icon: ShieldAlert,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-600",
    description: "Hạn chế một số tính năng trong thời gian nhất định",
  },
  {
    id: "banned" as ActionType,
    label: "Khoá tài khoản",
    icon: UserX,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-600",
    description: "Khoá tài khoản, user không thể đăng nhập",
  },
  {
    id: "no_action" as ActionType,
    label: "Không xử lý",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-600",
    description: "Báo cáo không hợp lệ hoặc không đủ bằng chứng",
  },
];

const DURATION_OPTIONS = [3, 7, 14, 30];
const FEATURE_OPTIONS = [
  { id: "like", label: "Like/Super Like" },
  { id: "message", label: "Nhắn tin" },
  { id: "match", label: "Match mới" },
];

export const ResolveReportModal: React.FC<ResolveReportModalProps> = ({
  report,
  open,
  onClose,
  onSuccess,
}) => {
  const [action, setAction] = useState<ActionType>("warning");
  const [adminNote, setAdminNote] = useState("");
  const [restrictionDays, setRestrictionDays] = useState(7);
  const [restrictedFeatures, setRestrictedFeatures] = useState<string[]>([
    "message",
  ]);
  const [banType, setBanType] = useState<"permanent" | "temporary">(
    "temporary",
  );
  const [banUntil, setBanUntil] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFeature = (featureId: string) => {
    setRestrictedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId],
    );
  };

  const handleSubmit = async () => {
    if (!adminNote.trim()) {
      setError("Vui lòng nhập ghi chú xử lý");
      return;
    }

    if (action === "restricted") {
      if (restrictedFeatures.length === 0) {
        setError("Vui lòng chọn ít nhất một tính năng bị hạn chế");
        return;
      }
    }

    if (action === "banned" && banType === "temporary" && !banUntil) {
      setError("Vui lòng chọn thời gian khoá");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: any = {
        action,
        adminNote: adminNote.trim(),
      };

      if (action === "restricted") {
        payload.restrictionDays = restrictionDays;
        payload.restrictedFeatures = restrictedFeatures;
      }

      if (action === "banned") {
        payload.banUntil = banType === "permanent" ? undefined : banUntil;
      }

      await resolveReport(report._id, payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xử lý báo cáo</DialogTitle>
          <DialogDescription>
            Quyết định hành động với user{" "}
            <strong>{report.targetUserId.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Action Selection */}
          <div className="space-y-2">
            <Label>Chọn hành động *</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {ACTIONS.map((actionOption) => {
                const Icon = actionOption.icon;
                return (
                  <button
                    key={actionOption.id}
                    onClick={() => setAction(actionOption.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-4 text-left transition-all hover:shadow-md",
                      action === actionOption.id
                        ? `${actionOption.borderColor} ${actionOption.bgColor} border-2`
                        : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 flex-shrink-0",
                        actionOption.color,
                      )}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {actionOption.label}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {actionOption.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Restriction Options */}
          {action === "restricted" && (
            <>
              <div className="space-y-2">
                <Label>Thời gian hạn chế</Label>
                <div className="grid grid-cols-4 gap-2">
                  {DURATION_OPTIONS.map((days) => (
                    <button
                      key={days}
                      onClick={() => setRestrictionDays(days)}
                      className={cn(
                        "rounded-lg border p-2 text-sm font-medium transition-colors",
                        restrictionDays === days
                          ? "border-orange-600 bg-orange-50 text-orange-700 dark:bg-orange-950/30"
                          : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
                      )}
                    >
                      {days} ngày
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tính năng bị hạn chế</Label>
                <div className="space-y-2">
                  {FEATURE_OPTIONS.map((feature) => (
                    <label
                      key={feature.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={restrictedFeatures.includes(feature.id)}
                        onChange={() => toggleFeature(feature.id)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium">
                        {feature.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Ban Options */}
          {action === "banned" && (
            <>
              <div className="space-y-2">
                <Label>Loại khoá</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBanType("temporary")}
                    className={cn(
                      "rounded-lg border p-3 text-sm font-medium transition-colors",
                      banType === "temporary"
                        ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/30"
                        : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
                    )}
                  >
                    Tạm thời
                  </button>
                  <button
                    onClick={() => setBanType("permanent")}
                    className={cn(
                      "rounded-lg border p-3 text-sm font-medium transition-colors",
                      banType === "permanent"
                        ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/30"
                        : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
                    )}
                  >
                    Vĩnh viễn
                  </button>
                </div>
              </div>

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
            </>
          )}

          {/* Admin Note */}
          <div className="space-y-2">
            <Label htmlFor="adminNote">Ghi chú xử lý *</Label>
            <Textarea
              id="adminNote"
              placeholder="Mô tả chi tiết về quyết định xử lý..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
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
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
