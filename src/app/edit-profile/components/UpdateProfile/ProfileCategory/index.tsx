import { ChevronDown } from "lucide-react";
import React from "react";

interface CategoryData {
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const UpdateProfileCategory = ({
  title,
  children,
  isActive,
  onClick,
}: CategoryData) => {
  return (
    <div
      className={`rounded-2xl py-6 px-6 mt-6 cursor-pointer transition-colors duration-300
        ${isActive ? "bg-gray-100" : "hover:bg-gray-50"} last:mb-20`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-[20px]">{title}</p>
        <ChevronDown
          className={`text-gray-300 size-6 transition-transform duration-300 ${
            isActive ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isActive ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default UpdateProfileCategory;
