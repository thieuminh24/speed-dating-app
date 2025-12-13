// components/admin/UserDetailModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AdminUser,
  unbanUser,
  unrestrictUser,
} from "@/services/admin/admin-user.api";
import {
  CheckCircle,
  Crown,
  ShieldAlert,
  UserX,
  Calendar,
  Mail,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface UserDetailModalProps {
  user: AdminUser;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  open,
  onClose,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUnban = async () => {
    setIsLoading(true);
    try {
      await unbanUser(user._id);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to unban:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnrestrict = async () => {
    setIsLoading(true);
    try {
      await unrestrictUser(user._id);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to unrestrict:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="flex items-start gap-4">
            <img
              src={user.photos[0] || "/placeholder-avatar.png"}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Tham gia:{" "}
                    {format(new Date(user.createdAt), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Account Status */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                Trạng thái tài khoản
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      user.accountStatus === "active"
                        ? "text-green-600"
                        : user.accountStatus === "banned"
                          ? "text-red-600"
                          : "text-orange-600"
                    }`}
                  >
                    {user?.accountStatus.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Warnings:</span>
                  <span className="font-medium text-gray-900">
                    {user.warningCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Status */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                Premium
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tier:</span>
                  <div className="flex items-center gap-1">
                    {user.isPremium && (
                      <Crown className="h-4 w-4 text-purple-600" />
                    )}
                    <span className="font-medium text-gray-900">
                      {user.subscriptionTier}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verified:</span>
                  {user.isPhotoVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <span className="text-gray-400 text-xs">
                      {user.verificationStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ban Info */}
          {user.isBanned && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
              <div className="flex items-start gap-3">
                <UserX className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900 dark:text-red-300">
                    Tài khoản bị khoá
                  </h4>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                    <strong>Lý do:</strong> {user.banReason}
                  </p>
                  {user.bannedAt && (
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      <strong>Khoá lúc:</strong>{" "}
                      {format(new Date(user.bannedAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </p>
                  )}
                  {user.banUntil && (
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      <strong>Khoá đến:</strong>{" "}
                      {format(new Date(user.banUntil), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </p>
                  )}
                  <Button
                    onClick={handleUnban}
                    disabled={isLoading}
                    className="mt-3"
                    variant="outline"
                    size="sm"
                  >
                    Mở khoá tài khoản
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Restriction Info */}
          {user.isRestricted && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/30">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-900 dark:text-orange-300">
                    Bị hạn chế
                  </h4>
                  <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                    <strong>Lý do:</strong> {user.restrictionReason}
                  </p>
                  {user.restrictedUntil && (
                    <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                      <strong>Hết hạn:</strong>{" "}
                      {format(
                        new Date(user.restrictedUntil),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        },
                      )}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                    <strong>Tính năng bị hạn chế:</strong>{" "}
                    {user.restrictedFeatures.join(", ")}
                  </p>
                  <Button
                    onClick={handleUnrestrict}
                    disabled={isLoading}
                    className="mt-3"
                    variant="outline"
                    size="sm"
                  >
                    Gỡ hạn chế
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Photos */}
          {user.photos.length > 0 && (
            <div>
              <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                Ảnh
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {user.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
