import React, { useRef, useState, useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { FaPlus, FaTimes, FaRedo } from "react-icons/fa";

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
    className={`w-32 h-32 border-rose-500 text-rose-500 bg-rose-50 border-2 border-dashed rounded-md flex flex-col justify-center items-center transition-opacity text-center ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer hover:opacity-75"
    }`}
  >
    <FaPlus size={20} />
  </div>
);

const ImageUploadForm = ({ name, control }: ImageUploadFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const replaceIndexRef = useRef<number | null>(null); // lưu vị trí cần replace
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // cleanup khi unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFiles = (newFiles: File[], onChange: (files: File[]) => void) => {
    if (newFiles.length === 0) return;

    // Nếu đang replace
    if (replaceIndexRef.current !== null) {
      const idx = replaceIndexRef.current;

      // cleanup ảnh cũ
      URL.revokeObjectURL(previewUrls[idx]);

      const updatedFiles = [...files];
      updatedFiles[idx] = newFiles[0]; // thay ảnh tại vị trí idx
      setFiles(updatedFiles);
      onChange(updatedFiles);

      const updatedPreviews = [...previewUrls];
      updatedPreviews[idx] = URL.createObjectURL(newFiles[0]);
      setPreviewUrls(updatedPreviews);

      replaceIndexRef.current = null; // reset lại
      return;
    }

    // Nếu thêm mới
    const allowedFiles = newFiles.slice(0, 4 - files.length);
    const updatedFiles = [...files, ...allowedFiles];
    setFiles(updatedFiles);
    onChange(updatedFiles);

    const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemove = (index: number, onChange: (files: File[]) => void) => {
    URL.revokeObjectURL(previewUrls[index]); // cleanup

    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    onChange(updatedFiles);
  };

  const handleReplace = (index: number) => {
    replaceIndexRef.current = index;
    inputRef.current?.click(); // trigger chọn file mới
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={false} // thay thế chỉ 1 ảnh
            onChange={(e) =>
              handleFiles(Array.from(e.target.files || []), onChange)
            }
            className="hidden"
          />

          {/* Upload + Preview */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {/* Nếu chưa đủ 4 ảnh thì hiện nút Upload */}
            {files.length < 4 && (
              <UploadBox
                onClick={() => {
                  replaceIndexRef.current = null; // reset, đảm bảo là thêm mới
                  inputRef.current?.click();
                }}
              />
            )}

            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-32 h-32">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-32 h-32 object-cover rounded-md border"
                />
                {/* Nút xoá */}
                <button
                  type="button"
                  onClick={() => handleRemove(index, onChange)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                >
                  <FaTimes size={12} />
                </button>
                {/* Nút thay thế */}
                <button
                  type="button"
                  onClick={() => handleReplace(index)}
                  className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                >
                  <FaRedo size={12} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    />
  );
};

export default ImageUploadForm;
