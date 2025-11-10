import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, MapPin } from "lucide-react";
import React, { ReactNode } from "react";
import { FaMarsStrokeUp } from "react-icons/fa6";
import { ImQuotesLeft } from "react-icons/im";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";
import { User } from "@/types/user.types";

export type UserBadge = {
  data: string;
  icon: ReactNode;
};

const CardInfo = ({ data }: { data: User }) => {
  console.log("data", data);
  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      spaceBetween={30}
      mousewheel={{ releaseOnEdges: true }}
      nested={true}
      modules={[Mousewheel]}
      className="h-full w-full rounded-4xl"
    >
      <SwiperSlide>
        <div className="h-full w-full flex items-center justify-center text-3xl">
          <div
            className="bg-cover bg-center w-1/2 h-full"
            style={{ backgroundImage: `url(${data.photos[0]})` }}
          ></div>
          <div className="bg-rose-200 h-full flex items-start justify-center text-3xl w-1/2 px-10 flex-col gap-2">
            <FaMarsStrokeUp size={40} />
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold">{`${data.name}, ${data.age}`}</h2>
              <Badge
                variant="secondary"
                className="bg-blue-500 text-white dark:bg-blue-600"
              >
                <BadgeCheckIcon />
                Photo Verified
              </Badge>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-rose-200 h-full flex items-center justify-center text-3xl">
          <div className="flex flex-col items-center gap-2 px-10">
            <ImQuotesLeft size={22} />
            <p className="text-[20px] font-extrabold">{`About ${data.name} `}</p>
            <p className="text-[12px]">{data.aboutMe}</p>
            <div className="flex gap-2 mt-2.5">
              {data.badge.map((badge, idx) => (
                <Badge key={idx} className="bg-rose-300 text-gray-950">
                  {badge.icon} {badge.data}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SwiperSlide>
      {/* DYNAMIC SLIDES: Prompt + Ảnh */}
      {data.prompts.map((prompt, idx) => (
        <SwiperSlide key={`prompt-${idx}`}>
          <div className="h-full w-full flex">
            {/* Ảnh thứ (idx + 1) */}
            {data.photos[idx + 1] ? (
              <div
                className="bg-cover bg-center w-1/2 h-full"
                style={{ backgroundImage: `url(${data.photos[idx + 1]})` }}
              />
            ) : (
              <></>
            )}

            {/* Prompt */}
            <div
              className={`bg-rose-200 h-full ${data.photos[idx + 1] ? "w-1/2" : "w-full"}  flex items-center justify-center p-8`}
            >
              <div className="flex flex-col items-center gap-4 text-center max-w-xs">
                <ImQuotesLeft size={28} />
                <p className="text-lg font-semibold">{prompt.prompt}</p>
                <p className="text-sm italic text-gray-700">
                  "{prompt.answer}"
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
      {/* EXTRA: Ảnh + placesLived (nếu còn ảnh) */}
      {data.photos.slice(data.prompts.length + 1).map((photo, idx) => (
        <SwiperSlide key={`extra-${idx}`}>
          <div className="h-full w-full flex">
            <div
              className="bg-cover bg-center w-1/2 h-full"
              style={{ backgroundImage: `url(${photo})` }}
            />
            <div className="bg-rose-200 h-full w-1/2 flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <MapPin className="w-8 h-8" />
                <p className="text-lg font-medium">Places I've lived</p>
                <p className="text-sm text-gray-700">
                  {data.basic?.placesLived || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardInfo;
