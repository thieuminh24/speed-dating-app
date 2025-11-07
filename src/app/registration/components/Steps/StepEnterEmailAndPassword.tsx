import InputForm from "@/components/forms/InputForm";
import React from "react";
import { Control } from "react-hook-form";

interface StepEnterEmailAndPasswordProps {
  control: Control<any, any>;
}

const StepEnterEmailAndPassword = ({
  control,
}: StepEnterEmailAndPasswordProps) => {
  return (
    <div className=" w-full max-w-md flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-semibold text-center">
        Enter your email and password
      </h2>

      <InputForm
        name="email"
        control={control}
        placeholder="Email"
        className="rounded-2xl py-5"
      />

      <InputForm
        name="password"
        control={control}
        placeholder="Password"
        className="rounded-2xl py-5"
        type="password"
      />
    </div>
  );
};

export default StepEnterEmailAndPassword;
