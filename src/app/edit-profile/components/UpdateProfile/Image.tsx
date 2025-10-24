"use client";

import React, { useState, ChangeEvent } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

interface PhotoGridProps {
  maxImages?: number;
}

const UpdateImage: React.FC<PhotoGridProps> = ({ maxImages = 6 }) => {
  const [images, setImages] = useState<string[]>([]);

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls].slice(0, maxImages));
  };

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3 max-w-md mx-auto">
      {images.map((src, index) => (
        <div
          key={index}
          className={`relative rounded-2xl border-2 p-2 overflow-hidden ${
            index === 0 ? "col-span-2 row-span-2" : ""
          }`}
        >
          <img
            src={src}
            alt={`photo-${index}`}
            className="w-full h-full object-cover rounded-2xl border"
          />
          <button
            onClick={() => handleRemove(index)}
            className="absolute top-2 right-2 bg-white rounded-bl-md p-1  hover:bg-gray-50 cursor-pointer transition"
          >
            <IoClose size={18} className="text-gray-700" />
          </button>
        </div>
      ))}

      {images.length < maxImages &&
        Array.from({ length: maxImages - images.length }).map((_, i) => (
          <label
            key={`add-${i}`}
            className="flex items-center justify-center h-32 rounded-2xl border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition"
          >
            <FaPlus className="text-gray-400" size={24} />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdd}
              className="hidden"
            />
          </label>
        ))}
    </div>
  );
};

export default UpdateImage;
