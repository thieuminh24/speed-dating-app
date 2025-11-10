import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaRegHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CardInfo, { User } from "./CardInfo";
import { LuRuler } from "react-icons/lu";
import { TbGlass, TbZodiacAquarius } from "react-icons/tb";
import {
  getRecommendationPartner,
  swipeUser,
} from "@/services/match/match.api";
import {
  Baby,
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
import NearbyMap from "@/app/nearby/components/NearbyMap";

export const mapApiUserToUser = (apiUser: any): User => {
  const basic = apiUser.basic || {};

  const badge = [
    ...(basic.height
      ? [{ data: `${basic.height} cm`, icon: <LuRuler /> }]
      : []),
    ...(basic.exercise ? [{ data: basic.exercise, icon: <Dumbbell /> }] : []),
    ...(basic.educationLevel
      ? [
          {
            data: basic.educationLevel,
            icon: <GraduationCap />,
          },
        ]
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
    age: apiUser.age,
    badge,
  };
};

const Discover = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"card" | "map">("card");
  const { location } = useUserLocation();

  // GỌI API CHỈ 1 LẦN → DÙNG CHUNG
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUsers = await getRecommendationPartner();
        const mappedUsers = apiUsers.map(mapApiUserToUser);
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // XỬ LÝ LIKE/PASS → CẬP NHẬT CHUNG CHO CẢ 2 VIEW
  // const handleSwipe = async (userId: string, isLike: boolean) => {
  //   try {
  //     await swipeUser(userId, isLike);
  //     setUsers((prev) => prev.filter((u) => u.id !== userId));
  //   } catch (error) {
  //     console.error("Swipe failed:", error);
  //   }
  // };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-[300px] h-[80px] overflow-hidden relative">
          <Image
            src="/image/CouplixMixLogo.png"
            alt="Couplix Logo"
            fill
            className="object-contain"
            priority
          />
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
      </div>

      {/* CARD VIEW */}
      {viewMode === "card" && (
        <>
          <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards]}
            onSwiper={setSwiperRef}
            className="mySwiper w-full max-w-[1307px] h-[70vh]"
          >
            {users.map((user) => (
              <SwiperSlide
                key={user.id}
                className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl overflow-hidden shadow-2xl"
              >
                <CardInfo data={user} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ACTION BUTTONS */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => {
                    const currentUser = users[swiperRef?.activeIndex];
                    // if (currentUser) handleSwipe(currentUser.id, false);
                  }}
                  className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-gray-300 cursor-pointer hover:scale-110 transition"
                >
                  <IoMdClose size={32} className="text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pass</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-amber-400 cursor-pointer hover:scale-110 transition">
                  <div className="relative w-12 h-12">
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
                      size={28}
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
                    const currentUser = users[swiperRef?.activeIndex];
                    // if (currentUser) handleSwipe(currentUser.id, true);
                  }}
                  className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-rose-400 cursor-pointer hover:scale-110 transition"
                >
                  <FaRegHeart size={32} className="text-rose-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      )}

      {/* MAP VIEW – DÙNG CHUNG `users` */}
      {viewMode === "map" && (
        <div className="w-full h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
          {location ? (
            <NearbyMap
              userLocation={location}
              users={users} // TRUYỀN DATA CHUNG
              // onSwipe={handleSwipe} // DÙNG CHUNG HÀM
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-600">Đang lấy vị trí...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discover;
