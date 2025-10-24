"use client";

import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { IoIosArrowBack } from "react-icons/io";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import StepEnterName from "./Steps/StepEnterName";
import StepEnterBirthday from "./Steps/StepEnterBirthday";
import StepEnterGender from "./Steps/StepEnterGender";
import StepUploadAvatar from "./Steps/StepUploadAvatar";
import StepEnterLocation from "./Steps/StepEnterLocation";
import { useRouter } from "next/navigation";

const steps = [
  StepEnterName,
  StepEnterBirthday,
  StepEnterGender,
  StepUploadAvatar,
  StepEnterLocation,
];

const RegistrationForm = () => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      gender: "",
      avatar: null,
      location: "",
    },
  });

  const { handleSubmit, control, getValues } = methods;
  const [currentStep, setCurrentStep] = useState(0);

  const router = useRouter();

  const StepComponent = steps[currentStep];

  const onNext = (data: any) => {
    // Merge data into form state
    methods.setValue(Object.keys(data)[0], Object.values(data)[0]);
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit((finalData) => {
        console.log("Final data:", finalData); // Optional: vẫn có thể log
        router.push("/app");
      })();
    }
  };

  const onBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-white">
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

        {/* Progress + Back */}
        <div className="flex items-center gap-4 w-full max-w-md mb-6">
          {currentStep > 0 && (
            <IoIosArrowBack
              onClick={onBack}
              className="cursor-pointer hover:opacity-50 transition-opacity"
              size={30}
            />
          )}
          <Progress
            value={progressValue}
            className="flex-grow [&>div]:bg-[#FD5169]"
          />
        </div>

        {/* Step Form */}
        <form
          onSubmit={handleSubmit(onNext)}
          className="flex flex-col gap-10 items-center w-full"
        >
          <StepComponent control={control} />

          <Button
            size="sm"
            type="submit"
            className="bg-[#FD5169] py-5 px-6 hover:transition cursor-pointer hover:bg-rose-500 rounded-4xl w-36"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Continue"}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default RegistrationForm;
