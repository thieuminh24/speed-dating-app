import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface InputFormProps {
  name: string;
  control: Control<any, any>;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  helperText?: string;
  type?: string;
  props?: any;
}

const InputForm = ({
  name,
  control,
  defaultValue,
  className,
  placeholder,
  helperText,
  type,
  ...props
}: InputFormProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          <div className="relative w-full">
            <Input
              {...props}
              className={className}
              {...field}
              placeholder={placeholder}
              type={
                type === "password" ? (isVisible ? "text" : "password") : type
              }
            />
            {type === "password" && (
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={() => setIsVisible((prevState) => !prevState)}
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent top-[3px]"
              >
                {isVisible ? <EyeOffIcon size={40} /> : <EyeIcon size={40} />}
                <span className="sr-only">
                  {isVisible ? "Hide password" : "Show password"}
                </span>
              </Button>
            )}
          </div>
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
