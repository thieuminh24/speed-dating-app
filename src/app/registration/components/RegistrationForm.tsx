"use client";

import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { IoIosArrowBack } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc"; // ✅ THÊM

import StepEnterName from "./Steps/StepEnterName";
import StepEnterBirthday from "./Steps/StepEnterBirthday";
import StepEnterGender from "./Steps/StepEnterGender";
import StepUploadAvatar from "./Steps/StepUploadAvatar";
import StepEnterLocation from "./Steps/StepEnterLocation";
import { useRouter, useSearchParams } from "next/navigation";
import StepEnterEmailAndPassword from "./Steps/StepEnterEmailAndPassword";
import { register } from "@/services/auth/auth.api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useAuth } from "@/store/auth.store";
import userService from "@/services/config";

// ✅ Bước registration khác nhau cho Google vs Local
const stepsLocal = [
  StepEnterEmailAndPassword,
  StepEnterName,
  StepEnterBirthday,
  StepEnterGender,
  StepUploadAvatar,
  StepEnterLocation,
];

const stepsGoogle = [
  // Skip email/password for Google users
  StepEnterBirthday,
  StepEnterGender,
  StepUploadAvatar,
  StepEnterLocation,
];

interface GoogleRegistrationData {
  googleId: string;
  email: string;
  name: string;
  photo: string;
}

const RegistrationForm = () => {
  const searchParams = useSearchParams();
  const isFromGoogle = searchParams.get("from") === "google";

  const [googleData, setGoogleData] = useState<GoogleRegistrationData | null>(
    null,
  );

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
      photos: [] as string[],
      location: { lat: 0, lon: 0 },
    },
  });

  const { handleSubmit, control, setValue, watch } = methods;
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login: loginStore } = useAuth();

  // ✅ Load Google data from sessionStorage
  useEffect(() => {
    if (isFromGoogle) {
      const storedData = sessionStorage.getItem("googleRegistrationData");
      if (storedData) {
        const data: GoogleRegistrationData = JSON.parse(storedData);
        setGoogleData(data);

        // Prefill form
        setValue("email", data.email);
        setValue("name", data.name);
        setValue("photos", [data.photo]);

        console.log("✅ Prefilled Google data:", data);
      }
    }
  }, [isFromGoogle, setValue]);

  // Choose steps based on registration type
  const steps = isFromGoogle ? stepsGoogle : stepsLocal;
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

      if (isFromGoogle && googleData) {
        // ========================================
        // GOOGLE REGISTRATION
        // ========================================
        console.log("🔐 Completing Google registration...");

        const payload = {
          googleId: googleData.googleId,
          email: googleData.email,
          name: data.name || googleData.name,
          dateOfBirth,
          gender: data.gender,
          photos: data.photos.length > 0 ? data.photos : [googleData.photo],
          location: data.location || { lat: 0, lon: 0 },
          // ❌ REMOVED: authProvider - backend will set this automatically
        };

        console.log("📤 Sending payload:", payload);

        // Call new endpoint: /auth/google/complete
        const res = await userService.post("/auth/google/complete", payload);
        const { token, ...user } = res.data;

        console.log("✅ Registration complete:", user);

        // Clear sessionStorage
        sessionStorage.removeItem("googleRegistrationData");

        // Login
        loginStore(token, user);
        router.push("/app");
      } else {
        // ========================================
        // LOCAL REGISTRATION (existing flow)
        // ========================================
        console.log("📧 Local registration...");

        const payload = {
          name: data.name,
          email: data.email,
          password: data.password,
          dateOfBirth,
          gender: data.gender,
          photos: data.photos,
          location: data.location || { lat: 0, lon: 0 },
        };

        const res = await register(payload);
        const { token, ...user } = res;

        loginStore(token, user);
        router.push("/app");
      }
    } catch (err: any) {
      console.error("❌ Registration error:", err);
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

        {/* Google Registration Badge */}
        {isFromGoogle && googleData && (
          <div className="mb-4 px-4 py-2 bg-blue-50 rounded-lg flex items-center gap-2">
            <FcGoogle className="text-xl" />
            <span className="text-sm text-gray-700">
              Completing registration with Google ({googleData.email})
            </span>
          </div>
        )}

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
