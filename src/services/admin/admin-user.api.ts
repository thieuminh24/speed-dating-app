// services/admin/admin-user.api.ts
import userService from "../config";

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  verificationStatus?: string;
  subscriptionTier?: string;
  accountStatus?: string;
  isPremium?: boolean;
  isDeleted?: boolean;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  photos: string[];
  role: string;
  accountStatus: "active" | "banned" | "restricted";
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
  banUntil?: string;
  isRestricted: boolean;
  restrictionReason?: string;
  restrictedUntil?: string;
  restrictedFeatures: string[];
  warningCount: number;
  isPremium: boolean;
  subscriptionTier: string;
  isPhotoVerified: boolean;
  verificationStatus: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  restrictedUsers: number;
  premiumUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  newUsers: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

// ===== GET ALL USERS =====
export const getAllUsers = async (filters: UserFilters) => {
  const { data } = await userService.get("/admin/users", { params: filters });
  return data;
};

// ===== GET USER DETAIL =====
export const getUserDetail = async (userId: string) => {
  const { data } = await userService.get(`/admin/users/${userId}`);
  return data;
};

// ===== GET STATISTICS =====
export const getUserStatistics = async (): Promise<UserStatistics> => {
  const { data } = await userService.get("/admin/users/statistics");
  return data;
};

// ===== BAN USER =====
export const banUser = async (
  userId: string,
  payload: { reason: string; banUntil?: string },
) => {
  const { data } = await userService.post(
    `/admin/users/${userId}/ban`,
    payload,
  );
  return data;
};

// ===== UNBAN USER =====
export const unbanUser = async (userId: string) => {
  const { data } = await userService.post(`/admin/users/${userId}/unban`);
  return data;
};

// ===== RESTRICT USER =====
export const restrictUser = async (
  userId: string,
  payload: { reason: string; days: number; features: string[] },
) => {
  const { data } = await userService.post(
    `/admin/users/${userId}/restrict`,
    payload,
  );
  return data;
};

// ===== UNRESTRICT USER =====
export const unrestrictUser = async (userId: string) => {
  const { data } = await userService.post(`/admin/users/${userId}/unrestrict`);
  return data;
};

// ===== DELETE USER =====
export const deleteUser = async (userId: string) => {
  const { data } = await userService.delete(`/admin/users/${userId}`);
  return data;
};

// ===== ADMIN UPDATE USER =====
export const adminUpdateUser = async (userId: string, payload: any) => {
  const { data } = await userService.patch(`/admin/users/${userId}`, payload);
  return data;
};
