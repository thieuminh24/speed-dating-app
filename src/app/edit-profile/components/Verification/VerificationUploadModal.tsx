// components/verification/VerificationUploadModal.tsx
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
import { Camera, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { submitVerification } from "@/services/verification/verification.api";
import { cn } from "@/lib/utils";

interface VerificationUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type UploadStep = "selfie" | "idCardFront" | "idCardBack" | "review";

export const VerificationUploadModal: React.FC<
  VerificationUploadModalProps
> = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState<UploadStep>("selfie");
  const [files, setFiles] = useState<{
    selfie?: File;
    idCardFront?: File;
    idCardBack?: File;
  }>({});
  const [previews, setPreviews] = useState<{
    selfie?: string;
    idCardFront?: string;
    idCardBack?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect =
    (type: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Chỉ chấp nhận file ảnh (JPG, PNG)");
        return;
      }

      setError(null);
      setFiles((prev) => ({ ...prev, [type]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);

      // Auto next step
      if (type === "selfie") setStep("idCardFront");
      else if (type === "idCardFront") setStep("idCardBack");
      else if (type === "idCardBack") setStep("review");
    };

  const handleRemove = (type: keyof typeof files) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[type];
      return newPreviews;
    });
  };

  const handleSubmit = async () => {
    if (!files.selfie || !files.idCardFront || !files.idCardBack) {
      setError("Vui lòng tải đủ 3 ảnh");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitVerification({
        selfie: files.selfie,
        idCardFront: files.idCardFront,
        idCardBack: files.idCardBack,
      });
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUploadBox = (
    type: keyof typeof files,
    title: string,
    description: string,
  ) => (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {previews[type] ? (
        <div className="relative">
          <img
            src={previews[type]}
            alt={title}
            className="h-48 w-full rounded-lg object-cover"
          />
          <button
            onClick={() => handleRemove(type)}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
            <CheckCircle2 size={12} />
            <span>Đã tải lên</span>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            step === type
              ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/30"
              : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect(type)}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nhấn để tải ảnh lên
            </span>
          </div>
        </label>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xác minh danh tính</DialogTitle>
          <DialogDescription>
            Tải lên ảnh selfie và CCCD/CMND của bạn để được xác thực
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div className="flex items-center justify-between">
            {["selfie", "idCardFront", "idCardBack"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full font-semibold",
                    files[s as keyof typeof files]
                      ? "bg-green-500 text-white"
                      : step === s
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700",
                  )}
                >
                  {files[s as keyof typeof files] ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div className="mx-2 h-0.5 w-8 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            ))}
          </div>

          {/* Upload boxes */}
          {renderUploadBox(
            "selfie",
            "1. Ảnh Selfie",
            "Chụp ảnh chân dung rõ mặt",
          )}
          {renderUploadBox(
            "idCardFront",
            "2. CCCD Mặt Trước",
            "Ảnh mặt trước có ảnh chân dung",
          )}
          {renderUploadBox(
            "idCardBack",
            "3. CCCD Mặt Sau",
            "Ảnh mặt sau có thông tin",
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !files.selfie ||
              !files.idCardFront ||
              !files.idCardBack ||
              isSubmitting
            }
          >
            {isSubmitting ? "Đang gửi..." : "Gửi xác thực"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
