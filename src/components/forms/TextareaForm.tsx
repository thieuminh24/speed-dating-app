import React from "react";
import { Control, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFormProps {
  name: string;
  control: Control<any, any>;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  helperText?: string;
  props?: any;
  maxlength?: number;
}

const TextareaForm = ({
  name,
  control,
  defaultValue,
  className,
  placeholder,
  helperText,
  maxlength,
  ...props
}: TextareaFormProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          <Textarea
            {...field}
            {...props}
            className={className}
            placeholder={placeholder}
            maxLength={maxlength}
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

export default TextareaForm;
