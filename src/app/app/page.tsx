"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-creative";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaRegHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { EffectCards } from "swiper/modules";
import CardInfo, { User } from "./components/CardInfo";
import { LuRuler } from "react-icons/lu";
import { TbGlass, TbZodiacAquarius } from "react-icons/tb";

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

export default function BumblePage() {
  const [interest, setInterest] = useState<string | null>(null);
  const [swiperRef, setSwiperRef] = useState<any>(null);

  const handlePass = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  const handleLike = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-3/12 border-r flex flex-col items-center justify-start p-6">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/100?img=3"
            alt="avatar"
            className="w-16 h-16 rounded-full mb-2"
          />
          <h2 className="font-semibold">Thiệu Minh</h2>
        </div>

        {/* Divider */}
        <Separator className="my-6" />

        {/* Empty state */}
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-20 h-20 flex items-center justify-center mb-4 text-gray-400">
            <Image
              className="dark:invert"
              src="/image/SearchLove.png"
              alt="SearchLove"
              width={180}
              height={38}
              priority
            />
          </div>
          <p className="font-medium">Get your matches here</p>
          <p className="text-sm text-gray-500">
            Start discovering people to get matches.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center ">
        <div className="flex mb-4 w-full flex-col items-center">
          <div className="w-[300px] h-[80px] overflow-hidden relative">
            <Image
              src="/image/CouplixMixLogo.png"
              alt="Couplix Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <Card className="w-11/12 shadow-none h-10/12 border-0 rounded-4xl flex flex-col justify-center py-0 ">
          <CardContent className="flex flex-col items-center w-full h-full px-0 ">
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
              className="mySwiper w-[1307px] h-full"
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
