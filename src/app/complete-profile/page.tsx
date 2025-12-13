// app/complete-profile/page.tsx
"use client";

import { useAuth } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import userService from "@/services/config";
import Image from "next/image";

type CompleteProfileForm = {
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  location: { lat: number; lon: number };
};

export default function CompleteProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CompleteProfileForm>();

  // Nếu không phải Google user mới → redirect
  useEffect(() => {
    if (!user?.isNewUser || user?.authProvider !== "google") {
      router.replace("/app");
    }
  }, [user, router]);

  const onSubmit = async (data: CompleteProfileForm) => {
    setIsLoading(true);
    try {
      // Update profile
      await userService.patch(`/users/${user?._id}`, {
        dateOfBirth: data.dateOfBirth,
        "basic.gender": data.gender,
        location: {
          type: "Point",
          coordinates: [data.location.lon, data.location.lat],
        },
      });

      // Redirect to app
      router.push("/app");
    } catch (err: any) {
      setError("root", {
        message: err.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.isNewUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <div className="text-center space-y-2">
            {user.photos[0] && (
              <Image
                src={user.photos[0]}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full mx-auto"
              />
            )}
            <h2 className="text-2xl font-bold">
              Welcome, {user.name.split(" ")[0]}! 👋
            </h2>
            <p className="text-gray-600">
              Please complete your profile to continue
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Date of Birth
              </label>
              <Input
                type="date"
                {...register("dateOfBirth", {
                  required: "Please enter your date of birth",
                })}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                className="w-full border rounded-md p-2"
                {...register("gender", { required: "Please select gender" })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {errors.root && (
              <p className="text-red-500 text-sm text-center">
                {errors.root.message}
              </p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
