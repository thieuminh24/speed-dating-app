import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, MapPin } from "lucide-react";
import React, { ReactNode } from "react";
import { FaMarsStrokeUp } from "react-icons/fa6";
import { ImQuotesLeft } from "react-icons/im";
import { Mousewheel } from "swiper/modules";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";

// import required modules
import { Pagination } from "swiper/modules";
import { Profile } from "@/app/edit-profile/types";

export type UserBadge = {
  data: string;
  icon: ReactNode;
};

const CardInfo = ({ data }: { data: Profile }) => {
  return (
    <Swiper
      direction={"vertical"}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="h-full w-full "
    >
      {/* ==== Slide 1: Ảnh + Tên, tuổi, verified ==== */}
      <SwiperSlide className="!overflow-hidden">
        <div className="flex h-full w-full">
          {/* Ảnh */}
          <div
            className="w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${data?.photos[0]})` }}
          />
          {/* Thông tin */}
          <div className="flex w-1/2 flex-col justify-center gap-4 bg-rose-200 p-8">
            <FaMarsStrokeUp size={40} />
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold">{`${data.name}, ${data?.age}`}</h2>
              <Badge
                variant="secondary"
                className="bg-blue-500 text-white dark:bg-blue-600"
              >
                <BadgeCheckIcon className="mr-1 h-4 w-4" />
                Photo Verified
              </Badge>
            </div>
            <div>
              <p className="font-medium">
                {data?.jobsAndEducation?.jobs[0].title} at{" "}
                {data?.jobsAndEducation?.jobs[0].company}
              </p>
              <p className="font-medium">
                {" "}
                {data?.jobsAndEducation?.education[0].institution},{" "}
                {data?.jobsAndEducation?.education[0].graduation}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* ==== Slide 2: About + Badges ==== */}
      <SwiperSlide className="!overflow-hidden">
        <div className="flex h-full items-center justify-center bg-rose-200 p-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <ImQuotesLeft size={22} />
            <p className="text-sm font-medium">About {data.name}</p>
            <p className="text-[16px] font-mono font-medium">{data.aboutMe}</p>
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

      {/* ==== Dynamic Prompt Slides ==== */}
      {data?.prompts?.map((prompt, idx) => (
        <SwiperSlide key={`prompt-${idx}`} className="!overflow-hidden">
          <div className="flex h-full w-full">
            {/* Ảnh (nếu có) */}
            {data.photos[idx + 1] ? (
              <div
                className="w-1/2 bg-cover bg-center"
                style={{ backgroundImage: `url(${data.photos[idx + 1]})` }}
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
              className="w-1/2 bg-cover bg-center"
              style={{ backgroundImage: `url(${photo})` }}
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
  );
};

export default CardInfo;
