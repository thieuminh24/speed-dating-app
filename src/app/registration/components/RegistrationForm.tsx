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
import StepEnterEmailAndPassword from "./Steps/StepEnterEmailAndPassword";
import { register } from "@/services/auth/auth.api";
import { Spinner, type SpinnerProps } from "@/components/ui/shadcn-io/spinner";

const steps = [
  StepEnterEmailAndPassword,
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
      email: "",
      password: "",
      name: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      gender: "",
      photos: [],
      location: { lat: 0, lon: 0 },
    },
  });

  const { handleSubmit, control, getValues, watch } = methods;
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Form Values:", watch());

  const router = useRouter();

  const StepComponent = steps[currentStep];

  const onNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const dateOfBirth = `${data.birthYear}-${data.birthMonth.padStart(2, "0")}-${data.birthDay.padStart(2, "0")}`;
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        dateOfBirth: dateOfBirth,
        gender: data.gender,
        photos: data.photos,
        location: data.location || { lat: 0, lon: 0 },
      };
      const res = await register(payload);
      const { token, ...user } = res;
      router.push("/app");
    } catch (err: any) {
      methods.setError("root", {
        message: err.response?.data?.message || "Lỗi server",
      });
    } finally {
      setIsLoading(false);
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
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="flex flex-col gap-10 items-center w-full"
        >
          <StepComponent control={control} />

          <Button type="button" onClick={onNext} disabled={isLoading}>
            {isLoading ? (
              <Spinner size="sm" />
            ) : currentStep === steps.length - 1 ? (
              "Finish"
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default RegistrationForm;
