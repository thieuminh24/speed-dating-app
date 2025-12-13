// src/components/match/FilterBar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Filter, Check } from "lucide-react";
import { useState } from "react";

export type GenderFilter = "All" | "Male" | "Female" | "Non-binary" | "Other";

export interface MatchFilters {
  minAge: number;
  maxAge: number;
  gender: GenderFilter;
}

interface FilterBarProps {
  filters: MatchFilters;
  onChange: (filters: MatchFilters) => void;
}

const genderOptions: { value: GenderFilter; label: string }[] = [
  { value: "All", label: "Tất cả" },
  { value: "Male", label: "Nam" },
  { value: "Female", label: "Nữ" },
  { value: "Non-binary", label: "Phi nhị nguyên" },
  { value: "Other", label: "Khác" },
];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const [localMinAge, setLocalMinAge] = useState(filters.minAge);
  const [localMaxAge, setLocalMaxAge] = useState(filters.maxAge);
  const [localGender, setLocalGender] = useState<GenderFilter>(filters.gender);

  const hasChanges =
    localMinAge !== filters.minAge ||
    localMaxAge !== filters.maxAge ||
    localGender !== filters.gender;

  const applyFilters = () => {
    onChange({
      minAge: localMinAge,
      maxAge: localMaxAge,
      gender: localGender,
    });
    setOpen(false);
  };

  const resetFilters = () => {
    setLocalMinAge(18);
    setLocalMaxAge(100);
    setLocalGender("All");
  };

  return (
    <div className="mt-2.5 z-30">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Bộ lọc
            {hasChanges && (
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-5" align="end">
          {/* Độ tuổi */}
          <div className="space-y-4">
            <Label>Độ tuổi</Label>
            <div className="flex justify-between text-sm font-medium">
              <span>{localMinAge}</span>
              <span className="text-gray-400">–</span>
              <span>{localMaxAge}</span>
            </div>
            <Slider
              value={[localMinAge, localMaxAge]}
              onValueChange={([min, max]) => {
                setLocalMinAge(min);
                setLocalMaxAge(max);
              }}
              min={18}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>18 tuổi</span>
              <span>100+ tuổi</span>
            </div>
          </div>

          {/* Giới tính */}
          <div className="mt-6 space-y-3">
            <Label>Giới tính</Label>
            <Command>
              <CommandList>
                <CommandGroup>
                  {genderOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => setLocalGender(option.value)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            localGender === option.value
                              ? "bg-rose-500 border-rose-500"
                              : "border-gray-300"
                          }`}
                        >
                          {localGender === option.value && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3 mt-8">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Xóa bộ lọc
            </Button>
            <Button
              onClick={applyFilters}
              disabled={!hasChanges}
              className="flex-1"
            >
              Áp dụng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
