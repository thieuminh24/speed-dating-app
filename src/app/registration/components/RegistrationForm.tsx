"use client";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { IoIosArrowBack } from "react-icons/io";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputForm from "@/components/forms/InputForm";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import StepEnterName from "./Steps/StepEnterName";
import StepEnterBirthday from "./Steps/StepEnterBirthday";
import StepEnterGender from "./Steps/StepEnterGender";
import StepUploadAvatar from "./Steps/StepUploadAvatar";
import StepEnterLocation from "./Steps/StepEnterLocation";

const RegistrationForm = () => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <div
        style={{ backgroundColor: "white" }}
        className="min-h-screen flex flex-col items-center px-4 py-8 "
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="w-[300px] h-[150px] overflow-hidden relative">
            <Image
              src="/image/CouplixMixLogo.png"
              alt="Couplix Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Progress Bar + Back Button */}
        <div className="flex items-center gap-4 w-full max-w-md mb-6">
          <IoIosArrowBack
            className="cursor-pointer hover:opacity-50 transition-opacity"
            size={30}
          />
          <Progress value={50} className="flex-grow [&>div]:bg-[#FD5169]" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10 items-center"
        >
          {/* <StepEnterName control={control} /> */}
          {/* <StepEnterBirthday control={control} /> */}
          {/* <StepEnterGender control={control} /> */}
          {/* <StepUploadAvatar control={control} /> */}
          <StepEnterLocation />
          <Button
            size="sm"
            type="submit"
            className="bg-[#FD5169] py-5 px-6 hover: transition cursor-pointer hover:bg-rose-500 rounded-4xl w-36 "
          >
            {/* <Loader2Icon className="animate-spin" /> */}
            Continue
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default RegistrationForm;
