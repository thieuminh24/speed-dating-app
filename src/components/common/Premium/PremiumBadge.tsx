"use client";

import { Crown } from "lucide-react";

interface PremiumBadgeProps {
  tier?: "Free" | "Premium" | "VIP";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function PremiumBadge({
  tier = "Free",
  size = "md",
  showLabel = false,
}: PremiumBadgeProps) {
  if (tier === "Free") return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const bgColor =
    tier === "VIP"
      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
      : "bg-gradient-to-r from-pink-500 to-purple-500";

  return (
    <div
      className={`flex items-center gap-1 ${bgColor} text-white px-2 py-1 rounded-full text-xs font-bold`}
    >
      <Crown className={sizeClasses[size]} />
      {showLabel && <span>{tier}</span>}
    </div>
  );
}

interface PremiumAvatarProps {
  src: string;
  alt: string;
  tier?: "Free" | "Premium" | "VIP";
  size?: number;
  className?: string;
}

export function PremiumAvatar({
  src,
  alt,
  tier = "Free",
  size = 56,
  className = "",
}: PremiumAvatarProps) {
  const isPremium = tier !== "Free";
  const gradientColor =
    tier === "VIP"
      ? "from-yellow-400 via-orange-400 to-yellow-500"
      : "from-pink-500 via-purple-500 to-pink-500";

  return (
    <div className={`relative ${className}`}>
      {isPremium ? (
        <>
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${gradientColor} p-[3px] animate-pulse`}
            style={{ width: size, height: size }}
          >
            <div className="w-full h-full rounded-full bg-white p-1">
              <img
                src={src}
                alt={alt}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1">
            <PremiumBadge tier={tier} size="sm" />
          </div>
        </>
      ) : (
        <img
          src={src}
          alt={alt}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
}
