import RadioGroupForm from "@/components/forms/RadioGroupForm";
import React from "react";
import { Control } from "react-hook-form";

interface StepEnterGenderProps {
  control: Control<any, any>;
}

const StepEnterGender = ({ control }: StepEnterGenderProps) => {
  return (
    <div className=" w-full max-w-md flex flex-col gap-6 items-center">
      <RadioGroupForm
        name="gender"
        control={control}
        questionLabel="What’s your gender?"
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Non-binary", value: "Non-binary" },
        ]}
        className="w-96"
        itemClassName="h-16"
      />
    </div>
  );
};

export default StepEnterGender;
