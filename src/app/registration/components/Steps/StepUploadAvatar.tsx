import ImageUploadForm from "@/components/forms/ImageUploadForm";
import Image from "next/image";
import React from "react";
import { Control } from "react-hook-form";

interface StepUploadAvatarProps {
  control: Control<any, any>;
}

const StepUploadAvatar = ({ control }: StepUploadAvatarProps) => {
  return (
    <div className=" w-full max-w-md flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-semibold text-center">
        Now it’s time to upload some photos
      </h2>
      <p>
        Adding photos is a great way to show off more about yourself! You can
        drag your photos right from your desktop.
      </p>

      <ImageUploadForm
        name="avatar"
        control={control}
        label="Upload your photo"
      />
    </div>
  );
};

export default StepUploadAvatar;
