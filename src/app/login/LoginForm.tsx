// app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Lottie from "lottie-react";
import LoadingAnimation from "../../../public/animations/Loading-1.json";
import LoadingMain from "../../../public/animations/Loading-3.json";
import { Quicksand } from "next/font/google";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { login } from "@/services/auth/auth.api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/store/auth.store";

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
    setError,
  } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login: loginStore } = useAuth();

  // Auto focus email
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await login(data);
      const { token, ...user } = res;
      loginStore(token, user); // ← Zustand lưu + persist
      router.push("/app");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Email hoặc mật khẩu không đúng";
      setError("root", { message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      {/* Logo */}
      <Image
        src="/image/Couplix.png"
        alt="Couplix Logo"
        width={300}
        height={300}
        priority
        className="absolute top-[-86px] left-5 w-32 md:w-48"
      />

      {/* Card */}
      <Card className="relative z-10 w-full max-w-md p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
        <CardHeader className="space-y-4">
          <Lottie
            animationData={LoadingMain}
            loop={true}
            style={{ width: 80, height: 80, margin: "0 auto" }}
          />
          <p
            className="text-3xl text-center font-bold"
            style={{ fontFamily: "var(--font-quicksand)" }}
          >
            Welcome to Couplix
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <Input
                ref={emailRef}
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="h-12 text-base rounded-2xl pl-5"
                style={{ fontFamily: "var(--font-quicksand)" }}
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email không hợp lệ",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Input
                type="password"
                placeholder="Mật khẩu"
                aria-label="Mật khẩu"
                className="h-12 text-base rounded-2xl pl-5"
                style={{ fontFamily: "var(--font-quicksand)" }}
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {errors.root && (
              <p className="text-red-500 text-sm text-center animate-pulse">
                {errors.root.message}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-700 hover:bg-zinc-800 text-white h-12 rounded-3xl transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Lottie
                    animationData={LoadingAnimation}
                    style={{ width: 24, height: 24 }}
                  />
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="mx-3 text-sm text-muted-foreground">hoặc</span>
              <Separator className="flex-1" />
            </div>
          </form>

          {/* Social Login */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              size="lg"
              type="button"
            >
              <FcGoogle size={20} /> Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 text-blue-600"
              size="lg"
              type="button"
            >
              <FaFacebookF size={20} /> Facebook
            </Button>
          </div>

          {/* Links */}
          <div className="text-center space-y-2 text-sm">
            <a
              href="/forgot-password"
              className="block text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </a>
            <p>
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
