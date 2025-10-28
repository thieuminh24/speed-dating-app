"use client";

import { Controller } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

interface HeightSelectorProps {
  control: any;
  name: string;
  onSkip?: () => void;
}

export function HeightSelector({ control, name, onSkip }: HeightSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Icon */}
      <Ruler className="text-rose-500 w-10 h-10" />

      {/* Title */}
      <h2 className="text-lg font-semibold text-center">
        What is your height?
      </h2>

      {/* Slider */}
      <Controller
        control={control}
        name={name}
        defaultValue={165}
        render={({ field: { value, onChange } }) => (
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center w-40 border ">
            <span className="text-lg font-medium">{value} cm</span>
            <Slider
              value={[value]}
              min={140}
              max={200}
              step={1}
              onValueChange={(v) => onChange(v[0])}
              className="mt-3 w-full text-yellow-500"
            />
          </div>
        )}
      />

      {/* Buttons */}
      <Button variant="outline" className="rounded-full w-56 cursor-pointer">
        Yup, that’s how tall I am
      </Button>
      <Button
        variant="ghost"
        onClick={onSkip}
        className="rounded-full cursor-pointer"
      >
        Skip
      </Button>
    </div>
  );
}
