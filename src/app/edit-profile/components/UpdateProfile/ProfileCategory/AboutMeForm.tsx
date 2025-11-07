"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaForm from "@/components/forms/TextareaForm";
import UpdateProfileCategory from ".";

const AboutMeForm = ({ aboutMe = " " }: { aboutMe: string }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const { control, setValue } = useForm<{ aboutMe: string }>({
    defaultValues: { aboutMe: "" },
  });

  useEffect(() => {
    setValue("aboutMe", aboutMe);
  }, [aboutMe]);

  return (
    <UpdateProfileCategory
      title={"About Me"}
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <TextareaForm
        control={control}
        name={`aboutMe`}
        className="rounded-3xl focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none max-w-[400px] p-4 border-gray-300 bg-white"
        maxlength={160}
      />
    </UpdateProfileCategory>
  );
};

export default AboutMeForm;
