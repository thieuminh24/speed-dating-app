"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Lottie from "lottie-react";
import LoadingAnimation from "../../../public/animations/Loading-1.json";
import { Quicksand } from "next/font/google";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import Image from "next/image";
import LoadingMain from "../../../public/animations/Loading-3.json";
import { Separator } from "@/components/ui/separator";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log("Login data:", data);
    // TODO: call your API
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/image/Couplix.png"
        alt="Couplix Logo"
        width={300}
        height={300}
        priority
        style={{ position: "absolute", top: -86, left: 20 }}
      />
      <Card className="relative z-10 w-4/12 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-neutral-200">
        <CardHeader>
          <Lottie
            animationData={LoadingMain}
            loop={true}
            style={{ width: "100px", height: "100px", margin: "0 auto" }}
          />
          <CardTitle
            className="text-3xl text-center font-bold mb-4"
            style={{ fontFamily: "var(--font-quicksand)" }}
          >
            Welcome to Couplix
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-0.5">
            <Input
              type="email"
              placeholder="Email"
              style={{
                fontFamily: "var(--font-quicksand)",
                height: "45px",
                fontSize: "16px",
                borderRadius: "18px",
                paddingLeft: "20px",
              }}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <Input
              type="password"
              placeholder="Password"
              style={{
                fontFamily: "var(--font-quicksand)",
                height: "45px",
                fontSize: "16px",
                borderRadius: "18px",
                paddingLeft: "20px",
              }}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-zinc-700 hover:bg-zinc-800 text-white h-10 border-none rounded-3xl cursor-pointer "
            >
              Log In
            </Button>
            <div className="flex items-center w-full">
              <Separator className="flex-1" />
              <span className="mx-2 text-sm text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>
          </form>

          <div className="flex items-center justify-center space-x-4 mt-4 mb-4">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
              size={"lg"}
            >
              <FcGoogle size={20} /> Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 text-blue-600 border-blue-400 cursor-pointer"
            >
              <FaFacebookF size={20} /> Facebook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
