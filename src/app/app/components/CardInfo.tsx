// src/app/app/components/CardInfo.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, MapPin, X } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { FaMarsStrokeUp } from "react-icons/fa6";
import { ImQuotesLeft } from "react-icons/im";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Thêm Dialog
import Image from "next/image"; // Dùng Next/Image cho full screen đẹp hơn
import { Profile } from "@/app/edit-profile/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export type UserBadge = {
  data: string;
  icon: ReactNode;
};

const CardInfo = ({ data }: { data: Profile }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const openFullScreen = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const closeFullScreen = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Swiper
        direction={"vertical"}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="h-full w-full"
      >
        {/* ==== Slide 1: Ảnh + Tên, tuổi, verified ==== */}
        <SwiperSlide className="!overflow-hidden">
          <div className="flex h-full w-full">
            {/* Ảnh - Click để phóng to */}
            <div
              className="w-1/2 bg-cover bg-center cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundImage: `url(${data?.photos[0]})` }}
              onClick={() => data?.photos[0] && openFullScreen(data.photos[0])}
            />
            {/* Thông tin */}
            <div className="flex w-1/2 flex-col justify-center gap-4 bg-rose-200 p-8">
              <FaMarsStrokeUp size={40} />
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold">{`${data.name}, ${data?.age}`}</h2>
                {data.isPhotoVerified && (
                  <Badge className="flex items-center gap-1 bg-emerald-300 text-gray-950">
                    <BadgeCheckIcon size={16} /> Verified
                  </Badge>
                )}
              </div>
              <div>
                {data?.jobsAndEducation?.jobs[0]?.title &&
                  data?.jobsAndEducation?.jobs[0]?.company && (
                    <p className="font-medium">
                      {data?.jobsAndEducation?.jobs[0]?.title} at{" "}
                      {data?.jobsAndEducation?.jobs[0]?.company}
                    </p>
                  )}
                <p className="font-medium">
                  {data?.jobsAndEducation?.education[0]?.institution},{" "}
                  {data?.jobsAndEducation?.education[0]?.graduation}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* ==== Slide 2: About + Badges ==== */}
        {data.aboutMe && (
          <SwiperSlide className="!overflow-hidden">
            <div className="flex h-full items-center justify-center bg-rose-200 p-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <ImQuotesLeft size={22} />
                <p className="text-sm font-medium">About {data.name}</p>
                <p className="text-[16px] font-mono font-medium">
                  {data.aboutMe}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.badge.map((badge, idx) => (
                    <Badge key={idx} className="bg-rose-300 text-gray-950">
                      {badge.icon} {badge.data}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}

        {/* ==== Dynamic Prompt Slides ==== */}
        {data?.prompts?.map((prompt, idx) => (
          <SwiperSlide key={`prompt-${idx}`} className="!overflow-hidden">
            <div className="flex h-full w-full">
              {/* Ảnh trong prompt - Click để phóng to */}
              {data.photos[idx + 1] ? (
                <div
                  className="w-1/2 bg-cover bg-center cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundImage: `url(${data.photos[idx + 1]})` }}
                  onClick={() => openFullScreen(data.photos[idx + 1])}
                />
              ) : null}

              {/* Prompt */}
              <div
                className={`flex h-full items-center justify-center bg-rose-200 p-8 ${
                  data.photos[idx + 1] ? "w-1/2" : "w-full"
                }`}
              >
                <div className="flex max-w-xs flex-col items-center gap-4 text-center">
                  <ImQuotesLeft size={28} />
                  <p className="text-lg font-semibold">{prompt.prompt}</p>
                  <p className="italic text-gray-700">"{prompt.answer}"</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* ==== Extra Photos + Places Lived ==== */}
        {data?.photos?.slice(data?.prompts?.length + 1).map((photo, idx) => (
          <SwiperSlide key={`extra-${idx}`} className="!overflow-hidden">
            <div className="flex h-full w-full">
              <div
                className="w-1/2 bg-cover bg-center cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundImage: `url(${photo})` }}
                onClick={() => openFullScreen(photo)}
              />
              <div className="flex w-1/2 flex-col items-center justify-center gap-2 bg-rose-200 p-8 text-center">
                <MapPin className="h-8 w-8" />
                <p className="text-lg font-medium">Places I've lived</p>
                <p className="text-sm text-gray-700">
                  {data.basic?.placesLived || "Not set"}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Dialog
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && closeFullScreen()}
      >
        <VisuallyHidden asChild>
          <DialogTitle>Xem ảnh toàn màn hình</DialogTitle>
        </VisuallyHidden>
        <DialogContent
          className="max-w-full max-h-full w-screen h-screen p-0 m-0 border-0 rounded-none bg-black [&>button]:hidden z-3000"
          // Quan trọng: loại bỏ padding, margin, border, max-width để full màn hình thật sự
        >
          {selectedPhoto && (
            <div className="relative w-[800px] h-full">
              <Image
                src={selectedPhoto}
                alt="Full screen photo"
                fill
                className="object-cover" // ĐỔI THÀNH object-cover ĐỂ ẢNH FILL HẾT MÀN HÌNH
                priority
                sizes="100vw"
              />

              {/* Nút đóng - giữ nguyên vị trí đẹp */}
              <button
                onClick={closeFullScreen}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 transition backdrop-blur-sm"
              >
                <X size={32} />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CardInfo;
