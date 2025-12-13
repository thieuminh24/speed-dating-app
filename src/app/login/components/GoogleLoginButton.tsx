// components/auth/GoogleLoginButton.tsx
"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { googleAuth } from "@/services/auth/auth.api";
import { useAuth } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import LoadingAnimation from "../../../../public/animations/Loading-1.json";

interface GoogleLoginButtonProps {
  onError?: (error: string) => void;
}

export default function GoogleLoginButton({ onError }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginStore } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("✅ Google OAuth Success:", tokenResponse);
      setIsLoading(true);
      try {
        console.log("🔐 Sending token to backend...");
        const res = await googleAuth({ idToken: tokenResponse.access_token });
        console.log("✅ Backend Response:", res);

        if (res.isNewUser) {
          // ========================================
          // NEW USER - Redirect to Registration
          // ========================================
          console.log("👤 New user, redirecting to registration...");

          // Store Google data in sessionStorage (temporary)
          sessionStorage.setItem(
            "googleRegistrationData",
            JSON.stringify(res.googleData),
          );

          // Redirect to registration page
          router.push("/registration?from=google");
        } else {
          // ========================================
          // EXISTING USER - Login Success
          // ========================================
          console.log("👤 Existing user, logging in...");

          const { token, ...user } = res;

          if (!token) {
            throw new Error("No token received from backend");
          }

          // Save to store
          loginStore(token, user);

          // Redirect to app
          router.push("/app");
        }
      } catch (err: any) {
        console.error("❌ Google login error:", err);
        console.error("❌ Error response:", err.response?.data);
        const message =
          err.response?.data?.message || "Đăng nhập Google thất bại";
        onError?.(message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("❌ Google OAuth error:", error);
      onError?.("Đăng nhập Google thất bại");
    },
  });

  return (
    <Button
      variant="outline"
      className="flex-1 flex items-center justify-center gap-2"
      size="lg"
      type="button"
      onClick={() => handleGoogleLogin()}
      disabled={isLoading}
    >
      {isLoading ? (
        <Lottie
          animationData={LoadingAnimation}
          style={{ width: 20, height: 20 }}
        />
      ) : (
        <FcGoogle size={20} />
      )}
      {isLoading ? "Đang xử lý..." : "Google"}
    </Button>
  );
}
