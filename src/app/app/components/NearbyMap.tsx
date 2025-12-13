// src/components/NearbyMap.tsx
import dynamic from "next/dynamic";
import { Profile } from "@/app/edit-profile/types";

// Dynamic import để tránh SSR Leaflet (window is not defined)
const NearbyMapClient = dynamic(() => import("./NearbyMapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-3xl">
      <p className="text-gray-600">Đang tải bản đồ...</p>
    </div>
  ),
});

interface NearbyMapProps {
  userLocation: { lat: number; lon: number } | null;
  users: Profile[];
  onSwipe?: (userId: string, isLike: boolean) => Promise<void>;
}

export default function NearbyMap({
  userLocation,
  users,
  onSwipe,
}: NearbyMapProps) {
  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-3xl">
        <p className="text-gray-600">Đang lấy vị trí...</p>
      </div>
    );
  }

  return (
    <NearbyMapClient
      userLocation={userLocation}
      users={users}
      onSwipe={onSwipe}
    />
  );
}
