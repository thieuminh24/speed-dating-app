// src/hooks/use-toast.ts
import { useState, useCallback } from "react";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast({ title, description, variant = "default" }: ToastProps) {
  // For now, use browser alert/console
  // You can replace this with a proper toast library like sonner or react-hot-toast
  if (variant === "destructive") {
    console.error(`❌ ${title}`, description);
    alert(`❌ ${title}\n${description || ""}`);
  } else {
    console.log(`✅ ${title}`, description);
  }
}

export function useToast() {
  return { toast };
}
