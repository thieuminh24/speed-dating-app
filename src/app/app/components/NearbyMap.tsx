// src/components/NearbyMap.tsx
"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "@/lib/leaflet-fix";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import CardInfo from "@/app/app/components/CardInfo";
import { UserDetailModal } from "@/app/app/components/UserDetailModal";
import ActionSwiper from "@/app/app/components/ActionSwiper";
import { Profile } from "@/app/edit-profile/types";

interface NearbyMapProps {
  userLocation: { lat: number; lon: number };
  users: Profile[];
  onSwipe?: (userId: string, isLike: boolean) => Promise<void>;
}

const NearbyMap: React.FC<NearbyMapProps> = ({
  userLocation,
  users,
  onSwipe,
}) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);

  const MapEvents = () => {
    useMapEvents({
      click: () => setIsCardOpen(false),
    });
    return null;
  };

  return (
    <>
      <MapContainer
        center={[userLocation.lat, userLocation.lon]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <MapEvents />

        {users.map((user) => {
          const icon = L.divIcon({
            html: `
              <div class="relative group cursor-pointer">
                <img
                  src="${user.photos[0]}"
                  class="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover ring-2 ring-white"
                  alt="${user.name}"
                />
                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            `,
            className: "bg-transparent",
            iconSize: [48, 48],
            iconAnchor: [24, 48],
          });

          return (
            <Marker
              key={user.id}
              position={[user.location.lat, user.location.lon]}
              icon={icon}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  setSelectedUser(user);
                  setIsCardOpen(true);
                },
              }}
            />
          );
        })}
      </MapContainer>
      {/* CARD MODAL */}
      <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
        <DialogContent
          className="
      w-full 
      max-w-lg 
      sm:max-w-xl 
      md:max-w-3xl 
      lg:max-w-6xl 
      h-[85vh] 
      p-0 
      overflow-hidden 
      rounded-3xl
    "
          style={{ zIndex: 1000 }}
        >
          {selectedUser && (
            <>
              <CardInfo data={selectedUser} />
              <ActionSwiper bottom="30px" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NearbyMap;
