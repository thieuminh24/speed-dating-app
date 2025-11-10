// src/app/nearby/page.tsx
"use client";

import { useUserLocation } from "@/hook/useUserLocation";
import NearbyMap from "./components/NearbyMap";

export default function NearbyPage() {
  const { location, error } = useUserLocation();

  if (error)
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Lỗi: {error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Vui lòng bật định vị trên trình duyệt
        </p>
      </div>
    );

  if (!location)
    return (
      <div className="p-8 text-center">
        <p>Đang lấy vị trí của bạn...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Người dùng gần bạn
      </h1>
      <NearbyMap userLocation={location} maxDistance={10} />
    </div>
  );
}
