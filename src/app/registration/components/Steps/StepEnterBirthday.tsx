import SelectForm from "@/components/forms/SelectForm";
import React from "react";
import { Control } from "react-hook-form";

interface StepEnterBirthdayProps {
  control: Control<any, any>;
}

const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

const yearOptions = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => {
  const year = 1970 + i;
  return { label: `${year}`, value: `${year}` };
});

const StepEnterBirthday = ({ control }: StepEnterBirthdayProps) => {
  return (
    <div className=" w-full max-w-md flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-semibold text-center">
        Hey Minh! When’s your birthday?
      </h2>
      <div className="flex gap-8">
        <SelectForm
          name="birthDay"
          control={control}
          placeholder="Ngày"
          label="Ngày sinh"
          options={dayOptions}
          className="w-28 h-10 text-sm"
        />

        <SelectForm
          name="birthMonth"
          control={control}
          placeholder="Tháng"
          label="Tháng sinh"
          className="w-28 h-10 text-sm"
          options={monthOptions}
        />

        <SelectForm
          name="birthYear"
          control={control}
          placeholder="Năm"
          label="Năm sinh"
          className="w-28 h-10 text-sm"
          options={yearOptions}
        />
      </div>
    </div>
  );
};

export default StepEnterBirthday;
