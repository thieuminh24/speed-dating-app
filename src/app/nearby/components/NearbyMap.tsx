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
import { User } from "@/types/user.types";

interface NearbyMapProps {
  userLocation: { lat: number; lon: number };
  users: User[];
  onSwipe?: (userId: string, isLike: boolean) => Promise<void>;
}

const NearbyMap: React.FC<NearbyMapProps> = ({
  userLocation,
  users,
  onSwipe,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
              key={user._id}
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
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
          {selectedUser && (
            <div className="relative">
              <CardInfo data={selectedUser} />
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-6 z-10">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-16 h-16 rounded-full shadow-xl"
                  onClick={() => onSwipe(selectedUser._id, false)}
                >
                  <X className="w-8 h-8" />
                </Button>
                <Button
                  size="icon"
                  className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 shadow-xl"
                  onClick={() => onSwipe(selectedUser._id, true)}
                >
                  <Heart className="w-8 h-8" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NearbyMap;
