"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaForm from "@/components/forms/TextareaForm";
import UpdateProfileCategory from ".";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/services/user/user.api";

const AboutMeForm = ({ aboutMe = " " }: { aboutMe: string }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const { control, setValue, handleSubmit } = useForm<{ aboutMe: string }>({
    defaultValues: { aboutMe: "" },
  });

  useEffect(() => {
    setValue("aboutMe", aboutMe);
  }, [aboutMe]);

  const onSubmit = async (data: string) => {
    await updateUser({ aboutMe: data?.aboutMe });
  };
  return (
    <UpdateProfileCategory
      title={"About Me"}
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TextareaForm
          control={control}
          name={`aboutMe`}
          className="rounded-3xl focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none max-w-[400px] p-4 border-gray-300 bg-white"
          maxlength={160}
        />
        <div className="flex justify-end mt-6">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </UpdateProfileCategory>
  );
};

export default AboutMeForm;
