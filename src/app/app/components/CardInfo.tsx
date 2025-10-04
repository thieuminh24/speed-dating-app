import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import React, { ReactNode } from "react";
import { FaMarsStrokeUp } from "react-icons/fa6";
import { ImQuotesLeft } from "react-icons/im";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/mousewheel";

export type UserBadge = {
  data: string;
  icon: ReactNode;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  badge: UserBadge[];
  images: string[];
};

const CardInfo = ({ data }: { data: User }) => {
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
            style={{ backgroundImage: `url(${data.avatar})` }}
          ></div>
          <div className="bg-rose-200 h-full flex items-start justify-center text-3xl w-1/2 px-10 flex-col gap-2">
            <FaMarsStrokeUp size={40} />

            <div className="flex  items-center gap-4">
              <h2 className="text-4xl font-extrabold">{`${data.name}, ${data.age}`}</h2>
              <Badge
                variant="secondary"
                className="bg-blue-500 text-white dark:bg-blue-600"
              >
                <BadgeCheckIcon />
                Photo Verified
              </Badge>
            </div>
            <p>Thanh Hoa</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-rose-200 h-full flex items-center justify-center text-3xl">
          <div className="flex flex-col items-center gap-2 px-10">
            <ImQuotesLeft size={22} />
            <p className="text-[20px] font-extrabold">
              {`About ${data.name}`}{" "}
            </p>
            <div className="flex gap-2">
              {data.badge.map((badge, idx) => (
                <Badge className="bg-rose-300 text-gray-950 ">
                  {badge.icon} {badge.data}{" "}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="h-full w-full flex">
          <div className="bg-[url('/image/demo1.jpg')] bg-cover bg-center w-1/2 h-full  flex items-center justify-center text-3xl"></div>
          <div className="bg-[url('/image/demo2.jpg')] bg-cover bg-center w-1/2 h-full  flex items-center justify-center text-3xl"></div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default CardInfo;
