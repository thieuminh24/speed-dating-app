// app/admin/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, AdminUser } from "@/services/admin/admin-user.api";
import { Search, Filter, RefreshCw, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { BanUserModal } from "./components/BanUserModal";
import { RestrictUserModal } from "./components/RestrictUserModal";
import { UserDetailModal } from "./components/UserDetailModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState<string>("all");
  const [verificationStatus, setVerificationStatus] = useState<string>("all");
  const [subscriptionTier, setSubscriptionTier] = useState<string>("all");

  // Modals
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, accountStatus, verificationStatus, subscriptionTier]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const filters: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (search) filters.search = search;
      if (accountStatus !== "all") filters.accountStatus = accountStatus;
      if (verificationStatus !== "all")
        filters.verificationStatus = verificationStatus;
      if (subscriptionTier !== "all")
        filters.subscriptionTier = subscriptionTier;

      const data = await getAllUsers(filters);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleUserAction = (
    user: AdminUser,
    action: "detail" | "ban" | "restrict",
  ) => {
    setSelectedUser(user);
    if (action === "detail") setShowDetailModal(true);
    else if (action === "ban") setShowBanModal(true);
    else if (action === "restrict") setShowRestrictModal(true);
  };

  const getStatusBadge = (user: AdminUser) => {
    if (user.isBanned) {
      return (
        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          Banned
        </span>
      );
    }
    if (user.isRestricted) {
      return (
        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
          Restricted
        </span>
      );
    }
    return (
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        Active
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý người dùng hệ thống
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Select value={accountStatus} onValueChange={setAccountStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={verificationStatus}
            onValueChange={setVerificationStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="approved">Đã xác thực</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
              <SelectItem value="none">Chưa gửi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Tìm thấy <strong>{pagination.total}</strong> người dùng
          </p>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Warnings
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photos[0] || "/placeholder-avatar.png"}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(user)}</td>
                    <td className="px-6 py-4">
                      {user.isPhotoVerified ? (
                        <span className="text-sm text-green-600">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          {user.verificationStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          user.isPremium ? "text-purple-600" : "text-gray-600",
                        )}
                      >
                        {user.subscriptionTier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {user.warningCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user, "detail")}
                          >
                            Xem chi tiết
                          </DropdownMenuItem>
                          {!user.isBanned && (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user, "ban")}
                            >
                              Khoá tài khoản
                            </DropdownMenuItem>
                          )}
                          {!user.isRestricted && (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user, "restrict")}
                            >
                              Hạn chế
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 dark:border-gray-700">
            <p className="text-sm text-gray-600">
              Trang {pagination.page} / {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          <UserDetailModal
            user={selectedUser}
            open={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            onUpdate={fetchUsers}
          />
          <BanUserModal
            user={selectedUser}
            open={showBanModal}
            onClose={() => setShowBanModal(false)}
            onSuccess={fetchUsers}
          />
          <RestrictUserModal
            user={selectedUser}
            open={showRestrictModal}
            onClose={() => setShowRestrictModal(false)}
            onSuccess={fetchUsers}
          />
        </>
      )}
    </div>
  );
}
