import React from "react";
import { Control, Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Kiểu dữ liệu cho options phẳng
type Option = {
  label: string;
  value: string;
};

// Kiểu dữ liệu cho options dạng group
type OptionGroup = {
  groupLabel: string;
  options: Option[];
};

interface SelectFormProps {
  name: string;
  control: Control<any, any>;
  placeholder?: string;
  label?: string;
  helperText?: string;
  className?: string; // 👉 dùng cho SelectTrigger
  disabled?: boolean;

  options?: Option[];
  groupedOptions?: OptionGroup[];
}

// Component nhỏ hiển thị helperText hoặc error
const FormMessage = ({
  message,
  isError = false,
}: {
  message?: string;
  isError?: boolean;
}) => {
  if (!message) return null;
  return (
    <p
      className={`ml-[14px] text-xs mt-1 ${
        isError ? "text-[#FF4C51]" : "text-[#8C8C8C] text-center"
      }`}
    >
      {message}
    </p>
  );
};

const SelectForm = ({
  name,
  control,
  placeholder,
  label,
  helperText,
  className,
  disabled = false,
  options,
  groupedOptions,
}: SelectFormProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          {label && <p className="mb-1 text-sm font-medium">{label}</p>}

          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {groupedOptions
                ? groupedOptions.map((group) => (
                    <SelectGroup key={group.groupLabel}>
                      <SelectLabel>{group.groupLabel}</SelectLabel>
                      {group.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))
                : options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>

          <FormMessage message={helperText} />
          <FormMessage message={error?.message} isError />
        </div>
      )}
    />
  );
};

export default SelectForm;
