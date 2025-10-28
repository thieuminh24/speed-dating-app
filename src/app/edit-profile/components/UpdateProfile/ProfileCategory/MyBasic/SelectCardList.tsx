"use client";

import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col gap-3">
          {/* Skip button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              field.onChange("");
              onSkip?.();
            }}
            className={cn(
              "w-full rounded-full font-medium border cursor-pointer",
              !field.value && "border-rose-400 text-black",
            )}
          >
            Skip
          </Button>

          {/* Options */}
          {options.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant="outline"
              onClick={() => field.onChange(opt.value)}
              className={cn(
                "w-full rounded-full border  text-gray-700 font-normal hover:border-rose-400 hover:text-rose-600 transition cursor-pointer",
                field.value === opt.value &&
                  "border-rose-400 text-black font-medium",
              )}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}
    />
  );
}
