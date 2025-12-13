// services/admin/admin-report.api.ts
import userService from "../config";

export interface ReportFilters {
  page?: number;
  limit?: number;
  status?: string;
  reason?: string;
  targetUserId?: string;
  reporterId?: string;
}

export interface Report {
  _id: string;
  reporterId: {
    _id: string;
    name: string;
    email: string;
    photos: string[];
  };
  targetUserId: {
    _id: string;
    name: string;
    email: string;
    photos: string[];
    accountStatus: string;
  };
  reason: string;
  description: string;
  attachedFiles: string[];
  status: "pending" | "reviewing" | "resolved";
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  adminNote?: string;
  adminAction?: string;
  restrictionDays?: number;
  restrictedFeatures?: string[];
  banUntil?: string;
  createdAt: string;
}

export interface ReportStatistics {
  totalReports: number;
  pendingReports: number;
  reviewingReports: number;
  resolvedReports: number;
  reportsByReason: Array<{ _id: string; count: number }>;
}

// ===== GET ALL REPORTS =====
export const getAllReports = async (filters: ReportFilters) => {
  const { data } = await userService.get("/reports/admin/all", {
    params: filters,
  });
  return data;
};

// ===== GET REPORT DETAIL =====
export const getReportDetail = async (reportId: string) => {
  const { data } = await userService.get(`/reports/admin/${reportId}`);
  return data;
};

// ===== GET REPORT STATISTICS =====
export const getReportStatistics = async (): Promise<ReportStatistics> => {
  const { data } = await userService.get("/reports/admin/statistics");
  return data;
};

// ===== UPDATE REPORT STATUS =====
export const updateReportStatus = async (
  reportId: string,
  payload: { status: string; adminNote?: string },
) => {
  const { data } = await userService.patch(
    `/reports/admin/${reportId}/status`,
    payload,
  );
  return data;
};

// ===== RESOLVE REPORT =====
export const resolveReport = async (
  reportId: string,
  payload: {
    action: "warning" | "restricted" | "banned" | "no_action";
    adminNote: string;
    restrictionDays?: number;
    restrictedFeatures?: string[];
    banUntil?: string;
  },
) => {
  const { data } = await userService.post(
    `/reports/admin/${reportId}/resolve`,
    payload,
  );
  return data;
};
