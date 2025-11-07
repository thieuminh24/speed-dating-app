"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { updateUser } from "@/services/user/user.api";

const CLOUDINARY_CLOUD_NAME = "dfx86lojh";
const UPLOAD_PRESET = "couplix_avatar_unsigned";

interface UpdateImageProps {
  maxImages?: number;
  photos?: string[];
}

const UpdateImage: React.FC<UpdateImageProps> = ({
  maxImages = 6,
  photos = [],
}) => {
  const [images, setImages] = useState<string[]>([]); // KHỞI TẠO RỖNG
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // 1. CHỜ photos CÓ DỮ LIỆU → CẬP NHẬT images
  useEffect(() => {
    if (photos && photos.length > 0) {
      setImages(photos);
    }
  }, [photos]);

  // 2. CHỈ GỌI API KHI NGƯỜI DÙNG THAY ĐỔI
  useEffect(() => {
    const persist = async () => {
      try {
        await updateUser({ photos: images });
      } catch (err) {
        console.error("Failed to update photos:", err);
      }
    };

    persist();
  }, [images]); // CHỈ DỰA VÀO images

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || uploading) return;

    const files = Array.from(e.target.files);
    const remaining = maxImages - images.length;
    const toUpload = files.slice(0, remaining);
    if (!toUpload.length) return;

    setUploading(true);

    const results = await Promise.all(
      toUpload.map(async (file, i) => {
        const idx = images.length + i;
        setUploadingIndex(idx);
        try {
          const url = await uploadToCloudinary(file);
          return { url, success: true };
        } catch {
          return { url: null, success: false };
        }
      }),
    );

    const newUrls = results
      .filter((r): r is { url: string; success: true } => r.success && !!r.url)
      .map((r) => r.url);

    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    setUploadingIndex(null);
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    const url = images[index];
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3 max-w-md mx-auto">
      {images.map((src, index) => (
        <div
          key={index}
          className={`relative rounded-2xl border-2 p-2 overflow-hidden bg-gray-50
            ${index === 0 ? "col-span-2 row-span-2" : ""}
            ${uploadingIndex === index ? "opacity-70" : ""}
          `}
        >
          <img
            src={src}
            alt={`photo-${index}`}
            className="w-full h-full object-cover rounded-xl"
          />
          {uploadingIndex === index && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
              <FaSpinner className="animate-spin text-white" size={28} />
            </div>
          )}
          <button
            onClick={() => handleRemove(index)}
            className="absolute top-2 right-2 bg-white rounded-bl-md p-1.5 hover:bg-gray-100 transition shadow-md"
            disabled={uploading}
          >
            <IoClose size={18} className="text-gray-700" />
          </button>
        </div>
      ))}

      {images.length < maxImages &&
        Array.from({ length: maxImages - images.length }).map((_, i) => {
          const tempIndex = images.length + i;
          const isUploadingHere = uploading && uploadingIndex === tempIndex;

          return (
            <label
              key={`add-${i}`}
              className={`
                relative flex items-center justify-center rounded-2xl border-2 border-dashed
                transition-all cursor-pointer overflow-hidden
                ${isUploadingHere ? "border-rose-500 bg-rose-50" : "border-gray-300 hover:bg-gray-50"}
                ${i === 0 && images.length === 0 ? "col-span-2 row-span-2" : "h-32"}
              `}
            >
              {isUploadingHere ? (
                <FaSpinner className="animate-spin text-rose-500" size={28} />
              ) : (
                <FaPlus className="text-gray-400" size={24} />
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdd}
                className="hidden"
                disabled={uploading}
              />
            </label>
          );
        })}
    </div>
  );
};

export default UpdateImage;
