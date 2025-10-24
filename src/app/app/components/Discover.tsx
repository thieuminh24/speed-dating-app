import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaRegHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { EffectCards } from "swiper/modules";
import { LuRuler } from "react-icons/lu";
import { TbGlass, TbZodiacAquarius } from "react-icons/tb";

import { Swiper, SwiperSlide } from "swiper/react";
import CardInfo, { User } from "./CardInfo";

// ...existing code...
const users: User[] = [
  {
    id: "1",
    name: "Quynh Nhu",
    avatar: "/image/demo.jpg",
    age: 18,
    location: "Thanh Hoa",
    badge: [
      { data: "168 cm", icon: <LuRuler /> },
      { data: "Socially", icon: <TbGlass /> },
      { data: "Aquarius", icon: <TbZodiacAquarius /> },
    ],
    images: ["/image/demo.jpg", "/image/demo1.jpg", "/image/demo2.jpg"],
  },
  {
    id: "2",
    name: "Như Quỳnh",
    avatar: "/image/demo2.jpg",
    age: 22,
    location: "Ha Noi",
    badge: [
      { data: "160 cm", icon: <LuRuler /> },
      { data: "Occasionally", icon: <TbGlass /> },
      { data: "Leo", icon: <TbZodiacAquarius /> },
    ],
    images: ["/image/demo3.jpg", "/image/demo4.jpg", "/image/demo5.jpg"],
  },
  {
    id: "3",
    name: "Bao Chau",
    avatar: "/image/demo1.jpg",
    age: 20,
    location: "Da Nang",
    badge: [
      { data: "170 cm", icon: <LuRuler /> },
      { data: "Never", icon: <TbGlass /> },
      { data: "Pisces", icon: <TbZodiacAquarius /> },
    ],
    images: ["/image/demo6.jpg", "/image/demo7.jpg", "/image/demo8.jpg"],
  },
  {
    id: "4",
    name: "Hoang Nam",
    avatar: "/image/demo3.jpg",
    age: 25,
    location: "Ho Chi Minh",
    badge: [
      { data: "175 cm", icon: <LuRuler /> },
      { data: "Frequently", icon: <TbGlass /> },
      { data: "Gemini", icon: <TbZodiacAquarius /> },
    ],
    images: ["/image/demo9.jpg", "/image/demo10.jpg", "/image/demo11.jpg"],
  },
];
// ...existing code...

const Discover = () => {
  const [interest, setInterest] = useState<string | null>(null);
  const [swiperRef, setSwiperRef] = useState<any>(null);

  const handlePass = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  const handleLike = () => {
    if (swiperRef) swiperRef.slideNext();
  };
  return (
    <>
      {/* <h1 className="text-xl font-bold mb-2">Let’s get Couplix</h1>
            <p className="text-gray-500 mb-6">And who are you interested in?</p> */}

      {/* Options */}
      {/* <div className="flex flex-col space-y-3 w-48">
              {["Men", "Women", "Everyone"].map((item) => (
                <Button
                  key={item}
                  onClick={() => setInterest(item)}
                  className={`w-full rounded-full font-medium cursor-pointer ${
                    interest === item
                      ? "bg-rose-400 text-white hover:bg-rose-500"
                      : "bg-rose-400 text-white hover:bg-rose-500"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </div> */}

      <Swiper
        effect="cards"
        grabCursor={true}
        modules={[EffectCards]}
        onSwiper={setSwiperRef}
        className="mySwiper w-[1307px] h-[89vh]"
      >
        {users.map((user, index) => (
          <SwiperSlide className="flex items-center justify-center bg-pink-200 text-xl font-semibold rounded-2xl">
            <CardInfo data={user} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-4 z-10 w-2/5 flex justify-center items-center left-[758px] gap-7">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handlePass}
              className=" right-1/2 translate-x-1/2 w-26 h-26  rounded-full p-2 bg-white shadow-lg flex items-center justify-center border-gray-300 border-2 cursor-pointer hover:scale-110 transition"
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
              className=" right-1/2 translate-x-1/2 w-26 h-26  border-2 rounded-full p-2 bg-white shadow-lg flex items-center justify-center hover:scale-110 transition cursor-pointer"
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
