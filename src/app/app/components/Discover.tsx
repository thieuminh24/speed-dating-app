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
import { getSwipeUsers, swipeUser } from "@/services/match/match.api";

// Hàm ánh xạ dữ liệu API sang kiểu User
const mapApiUserToUser = (apiUser: any): User => ({
  id: apiUser._id,
  name: apiUser.name, // Lấy từ đầu tiên của about làm tên
  avatar: apiUser.photos[0] || "/image/default.jpg", // Ảnh đầu tiên hoặc ảnh mặc định
  age: 25, // API không cung cấp tuổi, đặt mặc định hoặc cần thêm logic
  location: apiUser.places.live,
  badge: [
    ...(apiUser.basics.height
      ? [{ data: apiUser.basics.height, icon: <LuRuler /> }]
      : []),
    ...(apiUser.basics.drinking
      ? [{ data: apiUser.basics.drinking, icon: <TbGlass /> }]
      : []),
    ...(apiUser.basics.starSign
      ? [{ data: apiUser.basics.starSign, icon: <TbZodiacAquarius /> }]
      : []),
  ],
  images: apiUser.photos,
});

const Discover = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const currentUserId = "68facd3772bb5ba62dc72763"; // Thay bằng ID người dùng hiện tại, lấy từ context/auth

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUsers = await getSwipeUsers(currentUserId);
        const mappedUsers = apiUsers.map(mapApiUserToUser);
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching swipe users:", error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const handlePass = async () => {
    if (swiperRef && users.length > 0) {
      const currentUser = users[swiperRef.activeIndex];
      try {
        await swipeUser(currentUserId, currentUser.id, false); // Gọi API swipe với like = false
        swiperRef.slideNext();
      } catch (error) {
        console.error("Error passing user:", error);
      }
    }
  };

  const handleLike = async () => {
    if (swiperRef && users.length > 0) {
      const currentUser = users[swiperRef.activeIndex];
      try {
        await swipeUser(currentUserId, currentUser.id, true);
        swiperRef.slideNext();
      } catch (error) {
        console.error("Error liking user:", error);
      }
    }
  };

  return (
    <>
      <Swiper
        effect="cards"
        grabCursor={true}
        modules={[EffectCards]}
        onSwiper={setSwiperRef}
        className="mySwiper w-[1307px] h-[89vh]"
      >
        {users.map((user, index) => (
          <SwiperSlide
            key={user.id}
            className="flex items-center justify-center bg-pink-200 text-xl font-semibold rounded-2xl"
          >
            <CardInfo data={user} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-4 z-10 w-2/5 flex justify-center items-center left-[758px] gap-7">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handlePass}
              className="right-1/2 translate-x-1/2 w-26 h-26 rounded-full p-2 bg-white shadow-lg flex items-center justify-center border-gray-300 border-2 cursor-pointer hover:scale-110 transition"
            >
              <IoMdClose size={40} className="text-grey-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Pass</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleLike}
              className="right-1/2 translate-x-1/2 w-26 h-26 border-2 rounded-full p-2 bg-white shadow-lg flex items-center justify-center hover:scale-110 transition cursor-pointer"
            >
              <FaRegHeart size={40} className="text-red-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Like</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};

export default Discover;
