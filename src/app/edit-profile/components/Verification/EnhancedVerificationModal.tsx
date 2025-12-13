// components/verification/EnhancedVerificationModal.tsx
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
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  CreditCard,
} from "lucide-react";
import { submitVerification } from "@/services/verification/verification.api";
import {
  faceVerificationService,
  FaceMatchResult,
  ImageQualityResult,
} from "@/services/verification/face-verification.service";
import { cn } from "@/lib/utils";

interface EnhancedVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "upload" | "quality-check" | "face-match" | "review" | "submitting";

export const EnhancedVerificationModal: React.FC<
  EnhancedVerificationModalProps
> = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>("upload");
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

  // AI Results
  const [qualityResults, setQualityResults] = useState<{
    selfie?: ImageQualityResult;
    idCardFront?: ImageQualityResult;
    idCardBack?: ImageQualityResult;
  }>({});
  const [faceMatchResult, setFaceMatchResult] =
    useState<FaceMatchResult | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect =
    (type: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Chỉ chấp nhận file ảnh (JPG, PNG)");
        return;
      }

      setError(null);
      setFiles((prev) => ({ ...prev, [type]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
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
    setQualityResults((prev) => {
      const newResults = { ...prev };
      delete newResults[type];
      return newResults;
    });
  };

  // Step 1 → 2: Check quality
  const handleCheckQuality = async () => {
    console.log("🚀 [Modal] Starting quality check...");

    if (!files.selfie || !files.idCardFront || !files.idCardBack) {
      setError("Vui lòng tải đủ 3 ảnh");
      return;
    }

    console.log("📁 [Modal] Files ready:", {
      selfie: files.selfie.name,
      front: files.idCardFront.name,
      back: files.idCardBack.name,
    });

    setIsProcessing(true);
    setStep("quality-check");
    setError(null);

    try {
      console.log("🔍 [Modal] Checking selfie quality...");
      const selfieQuality = await faceVerificationService.checkImageQuality(
        files.selfie,
      );
      console.log("✅ [Modal] Selfie quality:", selfieQuality.score);

      console.log("🔍 [Modal] Checking front quality...");
      const frontQuality = await faceVerificationService.checkImageQuality(
        files.idCardFront,
      );
      console.log("✅ [Modal] Front quality:", frontQuality.score);

      console.log("🔍 [Modal] Checking back quality...");
      const backQuality = await faceVerificationService.checkImageQuality(
        files.idCardBack,
      );
      console.log("✅ [Modal] Back quality:", backQuality.score);

      setQualityResults({
        selfie: selfieQuality,
        idCardFront: frontQuality,
        idCardBack: backQuality,
      });

      console.log("✅ [Modal] All quality checks complete!");

      // Check if all pass
      const allGood =
        selfieQuality.isGoodQuality &&
        frontQuality.isGoodQuality &&
        backQuality.isGoodQuality;
      console.log("📊 [Modal] All good?", allGood);

      // ✅ FIX: LUÔN set processing = false trước khi check
      setIsProcessing(false);

      if (allGood) {
        // Auto proceed to face match
        console.log("🎉 [Modal] Quality passed! Proceeding to face match...");
        setTimeout(() => handleFaceMatch(), 1000);
      } else {
        console.log(
          "⚠️ [Modal] Quality issues detected. Staying at quality-check step.",
        );
        // ✅ User có thể review và quyết định tiếp tục hay không
      }
    } catch (err: any) {
      console.error("❌ [Modal] Quality check failed:", err);
      setError(err.message || "Có lỗi khi kiểm tra chất lượng ảnh");
      setIsProcessing(false);
      setStep("upload");
    }
  };

  // Step 2 → 3: Face matching
  const handleFaceMatch = async () => {
    setIsProcessing(true);
    setStep("face-match"); // hiện loading
    setError(null);

    try {
      const result = await faceVerificationService.matchFaces(
        files.selfie!,
        files.idCardFront!,
      );

      console.log("So khớp xong →", result);

      // LUÔN lưu kết quả
      setFaceMatchResult(result);

      // LUÔN tắt loading
      setIsProcessing(false);

      // LUÔN chuyển sang bước review (dù khớp hay không khớp)
      // Người dùng sẽ thấy kết quả xanh/đỏ ở bước review
      setTimeout(() => setStep("review"), 800);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lỗi khi so khớp khuôn mặt");
      setIsProcessing(false);
      setStep("upload"); // quay lại upload nếu lỗi thật
    }
  };

  // Final submit
  const handleSubmit = async () => {
    setStep("submitting");
    setIsProcessing(true);
    setError(null);

    try {
      await submitVerification({
        selfie: files.selfie!,
        idCardFront: files.idCardFront!,
        idCardBack: files.idCardBack!,
      });
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
      );
      setIsProcessing(false);
      setStep("review");
    }
  };

  const renderUploadBox = (
    type: keyof typeof files,
    title: string,
    icon: React.ReactNode,
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {icon}
        <span>{title}</span>
      </div>

      {previews[type] ? (
        <div className="relative">
          <img
            src={previews[type]}
            alt={title}
            className="h-40 w-full rounded-lg border border-gray-200 object-cover dark:border-gray-700"
          />
          <button
            onClick={() => handleRemove(type)}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X size={16} />
          </button>
          {qualityResults[type] && (
            <div
              className={cn(
                "absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                qualityResults[type]!.isGoodQuality
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white",
              )}
            >
              {qualityResults[type]!.isGoodQuality ? (
                <CheckCircle2 size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              <span>{qualityResults[type]!.score}%</span>
            </div>
          )}
        </div>
      ) : (
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect(type)}
          />
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Nhấn để tải ảnh
          </span>
        </label>
      )}

      {qualityResults[type] && !qualityResults[type]!.isGoodQuality && (
        <div className="space-y-1">
          {qualityResults[type]!.issues.map((issue, i) => (
            <p key={i} className="text-xs text-orange-600 dark:text-orange-400">
              • {issue}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xác minh danh tính</DialogTitle>
          <DialogDescription>
            Hệ thống sẽ tự động kiểm tra chất lượng ảnh và so khớp khuôn mặt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div className="flex items-center justify-between">
            {["upload", "quality-check", "face-match", "review"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    [
                      "quality-check",
                      "face-match",
                      "review",
                      "submitting",
                    ].includes(step) && i === 0
                      ? "bg-green-500 text-white"
                      : step === s
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700",
                  )}
                >
                  {[
                    "quality-check",
                    "face-match",
                    "review",
                    "submitting",
                  ].includes(step) && i === 0 ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && (
                  <div className="mx-2 h-0.5 w-8 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === "upload" && (
            <div className="grid gap-4 md:grid-cols-3">
              {renderUploadBox(
                "selfie",
                "Ảnh Selfie",
                <Camera className="h-4 w-4" />,
              )}
              {renderUploadBox(
                "idCardFront",
                "CCCD Mặt Trước",
                <CreditCard className="h-4 w-4" />,
              )}
              {renderUploadBox(
                "idCardBack",
                "CCCD Mặt Sau",
                <CreditCard className="h-4 w-4" />,
              )}
            </div>
          )}

          {step === "quality-check" && (
            <div className="space-y-4">
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Đang kiểm tra chất lượng ảnh...</span>
                </div>
              ) : (
                <>
                  {/* Show quality results */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Kết quả kiểm tra
                    </h3>
                    {Object.entries(qualityResults).map(([key, result]) => {
                      const labels = {
                        selfie: "Ảnh Selfie",
                        idCardFront: "CCCD Mặt Trước",
                        idCardBack: "CCCD Mặt Sau",
                      };
                      return (
                        <div
                          key={key}
                          className={cn(
                            "rounded-lg border p-3",
                            result?.isGoodQuality
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                              : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {labels[key as keyof typeof labels]}
                            </span>
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                result?.isGoodQuality
                                  ? "text-green-600"
                                  : "text-orange-600",
                              )}
                            >
                              {result?.score}%
                            </span>
                          </div>
                          {result && result.issues.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {result.issues.map((issue, i) => (
                                <p
                                  key={i}
                                  className="text-xs text-orange-700 dark:text-orange-400"
                                >
                                  • {issue}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Continue button if not all good */}
                  {!Object.values(qualityResults).every(
                    (r) => r?.isGoodQuality,
                  ) && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Một số ảnh có chất lượng chưa tốt. Bạn có thể chụp lại
                        hoặc tiếp tục với ảnh hiện tại.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setStep("upload");
                            setQualityResults({});
                          }}
                          size="sm"
                        >
                          Chụp lại
                        </Button>
                        <Button onClick={handleFaceMatch} size="sm">
                          Tiếp tục so khớp
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === "face-match" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang so khớp khuôn mặt...</span>
              </div>
            </div>
          )}

          {step === "review" && faceMatchResult && (
            <div className="space-y-4">
              <div
                className={cn(
                  "rounded-lg border p-4",
                  faceMatchResult.isMatch
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                    : faceMatchResult.confidence > 50
                      ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30"
                      : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
                )}
              >
                <div className="flex items-center gap-3">
                  {faceMatchResult.isMatch ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {faceMatchResult.message}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span>
                        Độ tin cậy:{" "}
                        <strong>{faceMatchResult.confidence}%</strong>
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            faceMatchResult.confidence > 70
                              ? "bg-green-500"
                              : faceMatchResult.confidence > 50
                                ? "bg-orange-500"
                                : "bg-red-500",
                          )}
                          style={{ width: `${faceMatchResult.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!faceMatchResult.isMatch && faceMatchResult.confidence < 50 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30">
                  <p className="font-medium">Không thể xác thực tự động</p>
                  <p className="mt-1">
                    Ảnh selfie và CCCD không khớp. Vui lòng chụp lại ảnh rõ nét
                    hơn hoặc liên hệ support.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "submitting" && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang gửi yêu cầu...</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">
              <AlertCircle className="mr-2 inline h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            {step === "review" ? "Đóng" : "Hủy"}
          </Button>
          {step === "upload" && (
            <Button
              onClick={handleCheckQuality}
              disabled={
                !files.selfie ||
                !files.idCardFront ||
                !files.idCardBack ||
                isProcessing
              }
            >
              Kiểm tra chất lượng
            </Button>
          )}
          {step === "review" && (
            <Button
              onClick={handleSubmit}
              disabled={
                isProcessing ||
                (faceMatchResult &&
                  !faceMatchResult.isMatch &&
                  faceMatchResult.confidence < 30)
              }
            >
              Gửi xác thực
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
