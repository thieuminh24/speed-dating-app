// app/admin/reports/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllReports, Report } from "@/services/admin/admin-report.api";
import { Flag, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ReportDetailModal } from "../components/ReportDetailModal";

const REPORT_REASONS = {
  scam: "Lừa đảo",
  fake_account: "Tài khoản giả",
  sexual_content: "Nội dung nhạy cảm",
  violence: "Bạo lực",
  spam: "Spam",
  underage: "Chưa đủ tuổi",
  other: "Khác",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [status, setStatus] = useState<string>("all");
  const [reason, setReason] = useState<string>("all");

  // Modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [pagination.page, status, reason]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const filters: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (status !== "all") filters.status = status;
      if (reason !== "all") filters.reason = reason;

      const data = await getAllReports(filters);
      setReports(data.reports);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      reviewing: "bg-blue-100 text-blue-700 border-blue-200",
      resolved: "bg-green-100 text-green-700 border-green-200",
    };
    const labels = {
      pending: "Chờ xử lý",
      reviewing: "Đang xử lý",
      resolved: "Đã xử lý",
    };
    return (
      <span
        className={cn(
          "rounded-full border px-2 py-1 text-xs font-medium",
          styles[status as keyof typeof styles],
        )}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Report Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý báo cáo vi phạm
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-4 md:grid-cols-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="reviewing">Đang xử lý</SelectItem>
              <SelectItem value="resolved">Đã xử lý</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Lý do" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lý do</SelectItem>
              {Object.entries(REPORT_REASONS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchReports}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-600">
            Tìm thấy <strong>{pagination.total}</strong> báo cáo
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <Flag className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">Không có báo cáo nào</p>
          </div>
        ) : (
          reports.map((report) => (
            <button
              key={report._id}
              onClick={() => {
                setSelectedReport(report);
                setShowDetailModal(true);
              }}
              className="flex w-full items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
            >
              {/* Reporter Info */}
              <div className="flex items-start gap-3">
                <img
                  src={report.reporterId.photos[0] || "/placeholder-avatar.png"}
                  alt={report.reporterId.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {report.reporterId.name}
                  </p>
                  <p className="text-xs text-gray-500">Người báo cáo</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center px-2">
                <Flag className="h-5 w-5 text-red-500" />
              </div>

              {/* Target User Info */}
              <div className="flex items-start gap-3">
                <img
                  src={
                    report.targetUserId.photos[0] || "/placeholder-avatar.png"
                  }
                  alt={report.targetUserId.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {report.targetUserId.name}
                  </p>
                  <p className="text-xs text-gray-500">Bị báo cáo</p>
                </div>
              </div>

              {/* Report Info */}
              <div className="ml-auto flex flex-col items-end gap-2">
                {getStatusBadge(report.status)}
                <div className="flex items-center gap-2">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {
                      REPORT_REASONS[
                        report.reason as keyof typeof REPORT_REASONS
                      ]
                    }
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
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

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onUpdate={fetchReports}
        />
      )}
    </div>
  );
}
