"use client";

import { useRouter } from "next/navigation";
import { Heart, Crown } from "lucide-react";
import { useAuth } from "@/store/auth.store";

export function LikesButton() {
  const router = useRouter();
  const { user } = useAuth();

  const isPremium =
    user?.isPremium &&
    user?.premiumUntil &&
    new Date(user.premiumUntil) > new Date();

  return (
    <button
      onClick={() => router.push("/likes")}
      className="relative group flex flex-col items-center"
    >
      <div
        className={`
        p-4 rounded-full transition-all
        ${
          isPremium
            ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg"
            : "bg-gray-100 hover:bg-gray-200"
        }
      `}
      >
        <Heart
          className={`w-6 h-6 ${isPremium ? "text-white fill-white" : "text-gray-600"}`}
        />
      </div>

      {!isPremium && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-md">
          <Crown className="w-3 h-3 text-white" />
        </div>
      )}

      <span
        className={`
        text-xs mt-2 font-medium
        ${isPremium ? "text-pink-600" : "text-gray-600"}
      `}
      >
        {isPremium ? "Likes" : "Unlock"}
      </span>
    </button>
  );
}
