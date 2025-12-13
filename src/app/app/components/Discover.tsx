// src/app/app/page.tsx (Updated)
"use client";

import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoMdClose } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { LuRuler } from "react-icons/lu";
import "swiper/css/effect-creative";
import {
  getRecommendationPartner,
  likeUser,
  passUser,
} from "@/services/match/match.api";
import {
  Baby,
  Check,
  Church,
  Cigarette,
  Dumbbell,
  GlassWater,
  GraduationCap,
  Grid3X3,
  Heart,
  HomeIcon,
  MapPin,
  Scale,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useUserLocation } from "@/hook/useUserLocation";
import { Button } from "@/components/ui/button";
import { EffectCreative } from "swiper/modules";
import { Profile } from "@/app/edit-profile/types";
import NearbyMap from "./NearbyMap";
import MatchModal from "./MatchModal";
import CardInfo from "./CardInfo";
import { StoryFeed } from "./story/StoryFeed";
import FilterBar from "./FilterBar";
import { MatchFilters } from "../types/filter.types";

export const mapApiUserToUser = (apiUser: any): Profile => {
  const basic = apiUser.basic || {};

  console.log("Mapping API user to Profile:", apiUser);

  const badge = [
    ...(basic.height
      ? [{ data: `${basic.height} cm`, icon: <LuRuler /> }]
      : []),
    ...(basic.exercise ? [{ data: basic.exercise, icon: <Dumbbell /> }] : []),
    ...(basic.educationLevel
      ? [{ data: basic.educationLevel, icon: <GraduationCap /> }]
      : []),
    ...(basic.drinking ? [{ data: basic.drinking, icon: <GlassWater /> }] : []),
    ...(basic.smoking ? [{ data: basic.smoking, icon: <Cigarette /> }] : []),
    ...(basic.lookingFor ? [{ data: basic.lookingFor, icon: <Heart /> }] : []),
    ...(basic.kids ? [{ data: basic.kids, icon: <Baby /> }] : []),
    ...(basic.politics ? [{ data: basic.politics, icon: <Scale /> }] : []),
    ...(basic.religion ? [{ data: basic.religion, icon: <Church /> }] : []),
    ...(basic.whereFrom ? [{ data: basic.whereFrom, icon: <MapPin /> }] : []),
    ...(basic.placesLived
      ? [{ data: basic.placesLived, icon: <HomeIcon /> }]
      : []),
  ];

  return {
    ...apiUser,
    id: apiUser._id,
    age: apiUser.age,
    badge,
  };
};

const Discover = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"card" | "map">("card");
  const { location } = useUserLocation();

  console.log("Users:", users);

  // Match modal state
  const [matchData, setMatchData] = useState<{
    matchId: string;
    matchedUser: { _id: string; name: string; photos: string[] };
  } | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // State cho filter
  const [filters, setFilters] = useState<MatchFilters>({
    minAge: 18,
    maxAge: 100,
    gender: "All",
  });

  // Fetch users với filter
  const fetchUsers = async () => {
    try {
      const apiFilters: any = {};

      if (filters.minAge > 18) apiFilters.minAge = filters.minAge;
      if (filters.maxAge < 100) apiFilters.maxAge = filters.maxAge;
      if (filters.gender !== "All") apiFilters.gender = filters.gender;

      const apiUsers = await getRecommendationPartner(apiFilters);
      const mappedUsers = apiUsers.map(mapApiUserToUser);
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Gọi lần đầu và mỗi khi filter thay đổi
  useEffect(() => {
    fetchUsers();
  }, [filters]); // Quan trọng: re-fetch khi filter đổi
  // Handle swipe
  const handleSwipe = async (userId: string, isLike: boolean) => {
    try {
      let response;
      if (isLike) {
        response = await likeUser(userId);
      } else {
        response = await passUser(userId);
      }

      // Check if it's a match
      if (response.matchId) {
        setMatchData({
          matchId: response.matchId,
          matchedUser: response.matchedUser,
        });
        setIsMatchModalOpen(true);
      }

      // Remove user from list
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      // Move to next card
      if (swiperRef) {
        swiperRef.slideNext();
      }
    } catch (error) {
      console.error("Swipe failed:", error);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-[300px] h-[80px] overflow-hidden relative">
          <StoryFeed />
        </div>

        {/* TAB SWITCH */}
        <div className="flex bg-gray-100 p-1 rounded-full mt-4">
          <Button
            variant={viewMode === "card" ? "default" : "ghost"}
            size="sm"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setViewMode("card")}
          >
            <Grid3X3 className="w-4 h-4" />
            Card
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="sm"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setViewMode("map")}
          >
            <MapPin className="w-4 h-4" />
            Map
          </Button>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* CARD VIEW */}
      {viewMode === "card" && (
        <>
          <Swiper
            onSwiper={setSwiperRef}
            grabCursor={true}
            effect={"creative"}
            creativeEffect={{
              prev: { shadow: true, translate: [0, 0, -400] },
              next: { translate: ["100%", 0, 0] },
            }}
            modules={[EffectCreative]}
            className="mySwiper w-full max-w-[1307px] h-full rounded-4xl"
          >
            {users.map((user) => (
              <SwiperSlide
                key={user.id}
                className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl overflow-hidden shadow-2xl w-full"
              >
                <CardInfo data={user} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ACTION BUTTONS */}
          <div className="absolute bottom-[-50] left-1/2 transform -translate-x-1/2 flex gap-6 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => {
                    const currentUser = users[swiperRef?.activeIndex || 0];
                    if (currentUser) handleSwipe(currentUser.id, false);
                  }}
                  className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center border-1 border-gray-300 cursor-pointer hover:scale-110 transition"
                >
                  <IoMdClose size={50} className="text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pass</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-amber-400 cursor-pointer hover:scale-110 transition">
                  <div className="relative w-24 h-24">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                        clipPath:
                          "polygon(50% 0%, 90% 25%, 90% 75%, 50% 100%, 10% 75%, 10% 25%)",
                      }}
                    />
                    <Star
                      size={50}
                      fill="white"
                      className="absolute inset-0 m-auto"
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>SuperSwipe</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => {
                    const currentUser = users[swiperRef?.activeIndex || 0];
                    if (currentUser) handleSwipe(currentUser.id, true);
                  }}
                  className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center border-1 cursor-pointer hover:scale-110 transition"
                >
                  <Check size={50} className="text-rose-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      )}

      {/* MAP VIEW */}
      {viewMode === "map" && (
        <div className="w-[95%] h-[80vh] mx-7 rounded-3xl overflow-hidden shadow-2xl">
          {location ? (
            <NearbyMap userLocation={location} users={users} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-600">Đang lấy vị trí...</p>
            </div>
          )}
        </div>
      )}

      {/* MATCH MODAL */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        matchData={matchData}
      />
    </div>
  );
};

export default Discover;
