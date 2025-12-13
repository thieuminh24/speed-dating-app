import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Star } from "lucide-react";
import React from "react";
import { IoMdClose } from "react-icons/io";

const ActionSwiper = ({ bottom }: { bottom: string }) => {
  return (
    <div
      className={`absolute bottom-[30px] left-1/2 transform -translate-x-1/2 flex gap-6 z-3000`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => {
              // const currentUser = users[swiperRef?.activeIndex];
              // if (currentUser) handleSwipe(currentUser.id, false);
            }}
            className="w-28 h-28  rounded-full bg-white shadow-xl flex items-center justify-center border-1 border-gray-300 cursor-pointer hover:scale-110 transition"
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
            // onClick={() => {
            //   const currentUser = users[swiperRef?.activeIndex];
            //   // if (currentUser) handleSwipe(currentUser.id, true);
            // }}
            className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center border-1  cursor-pointer hover:scale-110 transition"
          >
            <Check size={50} className="text-rose-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Like</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ActionSwiper;
