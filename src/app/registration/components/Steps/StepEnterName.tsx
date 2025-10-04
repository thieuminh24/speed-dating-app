import InputForm from "@/components/forms/InputForm";
import React from "react";
import { Control } from "react-hook-form";

interface StepEnterNameProps {
  control: Control<any, any>;
}

const StepEnterName = ({ control }: StepEnterNameProps) => {
  return (
    <div className=" w-full max-w-md flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-semibold text-center">
        Nice one! So, what do you like to be called?
      </h2>

      <InputForm
        name="name"
        control={control}
        placeholder="Your name..."
        className="rounded-2xl py-5"
        helperText="This is how you’ll appear on Couplix"
      />
    </div>
  );
};

export default StepEnterName;
