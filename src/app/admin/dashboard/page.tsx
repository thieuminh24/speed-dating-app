// app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  getUserStatistics,
  UserStatistics,
} from "@/services/admin/admin-user.api";
import {
  getReportStatistics,
  ReportStatistics,
} from "@/services/admin/admin-report.api";
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Crown,
  CheckCircle,
  Clock,
  Flag,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
];

export default function AdminDashboardPage() {
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [reportStats, setReportStats] = useState<ReportStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const [users, reports] = await Promise.all([
        getUserStatistics(),
        getReportStatistics(),
      ]);
      setUserStats(users);
      setReportStats(reports);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Tổng người dùng",
      value: userStats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Người dùng hoạt động",
      value: userStats?.activeUsers || 0,
      icon: UserCheck,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Tài khoản bị khoá",
      value: userStats?.bannedUsers || 0,
      icon: UserX,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgLight: "bg-red-50",
    },
    {
      title: "Bị hạn chế",
      value: userStats?.restrictedUsers || 0,
      icon: ShieldAlert,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
    },
    {
      title: "Premium Users",
      value: userStats?.premiumUsers || 0,
      icon: Crown,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Đã xác thực",
      value: userStats?.verifiedUsers || 0,
      icon: CheckCircle,
      color: "bg-teal-500",
      textColor: "text-teal-600",
      bgLight: "bg-teal-50",
    },
    {
      title: "Chờ xác thực",
      value: userStats?.pendingVerifications || 0,
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
    },
    {
      title: "Báo cáo chờ xử lý",
      value: reportStats?.pendingReports || 0,
      icon: Flag,
      color: "bg-pink-500",
      textColor: "text-pink-600",
      bgLight: "bg-pink-50",
    },
  ];

  const newUsersData = [
    { name: "Hôm nay", value: userStats?.newUsers.today || 0 },
    { name: "Tuần này", value: userStats?.newUsers.thisWeek || 0 },
    { name: "Tháng này", value: userStats?.newUsers.thisMonth || 0 },
  ];

  const reportReasonData =
    reportStats?.reportsByReason.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tổng quan hệ thống quản lý
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`rounded-full ${stat.bgLight} p-3 dark:bg-opacity-20`}
                >
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* New Users Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Người dùng mới
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={newUsersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Report Reasons Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Flag className="h-5 w-5 text-pink-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Báo cáo theo lý do
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportReasonData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportReasonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
