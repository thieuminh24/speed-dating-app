import React from "react";
import { Control, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupFormProps {
  name: string;
  control: Control<any>;
  questionLabel?: string;
  options: RadioOption[];
  className?: string; // lớp của wrapper ngoài cùng
  itemClassName?: string; // lớp của mỗi lựa chọn
  direction?: "vertical" | "horizontal";
}

const RadioGroupForm = ({
  name,
  control,
  questionLabel,
  options,
  className = "",
  itemClassName = "",
  direction = "vertical",
}: RadioGroupFormProps) => {
  const layoutClass =
    direction === "horizontal" ? "flex gap-4 flex-wrap" : "space-y-3";

  return (
    <div className={`space-y-4 ${className}`}>
      {questionLabel && (
        <h2 className="text-center text-lg font-semibold">{questionLabel}</h2>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className={layoutClass}
          >
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className={`flex items-center gap-4 border rounded-xl px-4 py-3 cursor-pointer transition-colors hover:border-rose-300 data-[state=checked]:border-rose-300 ${itemClassName}`}
              >
                <RadioGroupItem
                  id={option.value}
                  value={option.value}
                  className="text-rose-300 border-rose-300 [&_svg]:fill-rose-300"
                />
                <span className="text-base">{option.label}</span>
              </label>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
};

export default RadioGroupForm;
