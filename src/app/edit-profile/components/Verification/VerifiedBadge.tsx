// components/verification/VerifiedBadge.tsx
"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = "md",
  showText = true,
  className,
}) => {
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-base gap-2",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium text-emerald-600 dark:text-emerald-400",
        sizeClasses[size],
        className,
      )}
    >
      <CheckCircle2
        size={iconSizes[size]}
        className="fill-emerald-600 text-white dark:fill-emerald-400"
      />
      {showText && <span>Photo Verified</span>}
    </div>
  );
};

// Variant: Badge style (như tag)
export const VerifiedBadgeTag: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300",
        className,
      )}
    >
      <CheckCircle2
        size={12}
        className="fill-emerald-600 text-white dark:fill-emerald-400"
      />
      <span>Verified</span>
    </div>
  );
};
