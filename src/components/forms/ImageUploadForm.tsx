"use client";

import React, { useRef, useState, useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { FaPlus, FaTimes, FaRedo, FaSpinner } from "react-icons/fa";

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = "dfx86lojh"; // Thay bằng cloud_name của bạn
const UPLOAD_PRESET = "couplix_avatar_unsigned"; // Tên unsigned preset

interface ImageUploadFormProps {
  name: string;
  control: Control<any>;
  label?: string;
  className?: string;
}

interface UploadBoxProps {
  onClick?: () => void;
  disabled?: boolean;
}

const UploadBox = ({ onClick, disabled }: UploadBoxProps) => (
  <div
    onClick={!disabled ? onClick : undefined}
    className={`
      w-32 h-32 border-rose-500 text-rose-500 bg-rose-50 
      border-2 border-dashed rounded-md flex flex-col justify-center items-center 
      transition-all text-center
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-75"}
    `}
  >
    <FaPlus size={20} />
    <span className="text-xs mt-1">Thêm ảnh</span>
  </div>
);

const ImageUploadForm = ({
  name,
  control,
  label,
  className,
}: ImageUploadFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const replaceIndexRef = useRef<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.secure_url;
  };

  const handleFiles = async (
    newFiles: File[],
    onChange: (urls: string[]) => void,
  ) => {
    if (newFiles.length === 0) return;

    const file = newFiles[0]; // chỉ 1 file mỗi lần
    const index = replaceIndexRef.current ?? previewUrls.length;

    if (index > 3) {
      setError("Chỉ được upload tối đa 4 ảnh");
      return;
    }

    setUploadingIndex(index);
    setError(null);

    try {
      const url = await uploadToCloudinary(file);

      // Cập nhật preview
      if (replaceIndexRef.current !== null) {
        // Thay thế ảnh cũ
        const oldUrl = previewUrls[replaceIndexRef.current];
        if (oldUrl.startsWith("blob:")) URL.revokeObjectURL(oldUrl);

        const newPreviews = [...previewUrls];
        newPreviews[replaceIndexRef.current] = url;
        setPreviewUrls(newPreviews);
      } else {
        // Thêm mới
        setPreviewUrls((prev) => [...prev, url]);
      }

      // Cập nhật form value (chỉ lưu URL)
      const currentUrls = (control._formValues[name] as string[]) || [];
      const updatedUrls = [...currentUrls];
      updatedUrls[index] = url;
      onChange(updatedUrls.slice(0, 4)); // giới hạn 4
    } catch (err) {
      setError("Upload thất bại. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setUploadingIndex(null);
      replaceIndexRef.current = null;
    }
  };

  const handleRemove = (index: number, onChange: (urls: string[]) => void) => {
    const url = previewUrls[index];
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);

    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);

    const currentUrls = (control._formValues[name] as string[]) || [];
    const updatedUrls = currentUrls.filter((_, i) => i !== index);
    onChange(updatedUrls);
  };

  const handleReplace = (index: number) => {
    replaceIndexRef.current = index;
    inputRef.current?.click();
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field: { onChange, value } }) => {
        // Đồng bộ preview với value từ form
        useEffect(() => {
          const formUrls = (value as string[]) || [];
          setPreviewUrls((prev) => {
            const newPreviews = formUrls.filter(
              (url: string) => url && !prev.includes(url),
            );
            return [
              ...prev.filter((p) => formUrls.includes(p)),
              ...newPreviews,
            ];
          });
        }, [value]);

        return (
          <div className={className}>
            {label && (
              <label className="block text-sm font-medium mb-2">{label}</label>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFiles(Array.from(e.target.files || []), onChange)
              }
              className="hidden"
            />

            {/* Upload + Preview */}
            <div className="flex gap-4 mt-4 flex-wrap">
              {/* Nút thêm ảnh */}
              {previewUrls.length < 4 && (
                <UploadBox
                  onClick={() => {
                    replaceIndexRef.current = null;
                    inputRef.current?.click();
                  }}
                  disabled={uploadingIndex !== null}
                />
              )}

              {/* Preview ảnh */}
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-32 h-32">
                  <div className="w-32 h-32 rounded-md border overflow-hidden">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {uploadingIndex === index && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <FaSpinner
                          className="animate-spin text-white"
                          size={20}
                        />
                      </div>
                    )}
                  </div>

                  {/* Nút xóa */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index, onChange)}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white p-1.5 rounded-full hover:bg-opacity-80 transition"
                    disabled={uploadingIndex !== null}
                  >
                    <FaTimes size={12} />
                  </button>

                  {/* Nút thay thế */}
                  <button
                    type="button"
                    onClick={() => handleReplace(index)}
                    className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white p-1.5 rounded-full hover:bg-opacity-80 transition"
                    disabled={uploadingIndex !== null}
                  >
                    <FaRedo size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        );
      }}
    />
  );
};

export default ImageUploadForm;
