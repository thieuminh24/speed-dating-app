import React from "react";
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface InputFormProps {
  name: string;
  control: Control<any, any>;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  helperText?: string;
  props?: any;
}

const InputForm = ({
  name,
  control,
  defaultValue,
  className,
  placeholder,
  helperText,
  ...props
}: InputFormProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          <Input
            {...props}
            className={className}
            {...field}
            placeholder={placeholder}
          />
          {helperText && (
            <p className="ml-[14px] text-[#8C8C8C] text-xs text-center">
              {helperText}
            </p>
          )}
          {error?.message && (
            <p className="ml-[14px] text-[#FF4C51] text-xs mt-1">
              {error?.message}
            </p>
          )}
        </>
      )}
    />
  );
};

export default InputForm;
