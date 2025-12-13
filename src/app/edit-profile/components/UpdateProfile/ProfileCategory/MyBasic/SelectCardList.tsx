"use client";

import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; // ← Thêm import này

interface SelectCardListProps {
  name: string;
  control: any;
  options: { label: string; value: string }[];
  onSkip?: () => void;
}

export function SelectCardList({
  name,
  control,
  options,
  onSkip,
}: SelectCardListProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ScrollArea className="h-[60vh] pr-4">
          {" "}
          {/* ← Giới hạn chiều cao + padding phải để scroll đẹp */}
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant="outline"
                onClick={() => field.onChange(opt.value)}
                className={cn(
                  "w-full rounded-full border text-gray-700 font-normal hover:border-rose-400 hover:text-rose-600 transition justify-start text-left py-6", // py-6 để nút cao hơn, dễ bấm
                  field.value === opt.value &&
                    "border-rose-400 text-black font-medium bg-rose-50",
                )}
              >
                {opt.label}
              </Button>
            ))}

            {/* Optional: Nút Skip */}
            {onSkip && (
              <Button
                type="button"
                variant="ghost"
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip
              </Button>
            )}
          </div>
        </ScrollArea>
      )}
    />
  );
}
