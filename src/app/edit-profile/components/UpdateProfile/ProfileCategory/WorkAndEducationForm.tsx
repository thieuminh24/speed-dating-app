"use client";

import React, { useState } from "react";
import UpdateProfileCategory from ".";
import { DialogForm } from "@/components/common/Dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputForm from "@/components/forms/InputForm";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yearOptions } from "@/constants/date-options.constant";
import SelectForm from "@/components/forms/SelectForm";
import { SelectCard } from "@/components/common/SelectCard";

const WorkAndEducationForm = () => {
  const form = useForm<WorkAndEducationData>({
    defaultValues: {},
  });
  const { control } = form;
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <UpdateProfileCategory
      title={"My Work & Education"}
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <Form {...form}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-gray-500">
              Your Job
            </label>
            <SelectCard title="Minh hehe" content="ABC" selected />
          </div>

          <DialogForm
            dialogTitle="Edit job"
            dialogTrigger={
              <Button variant="outline" className="w-full">
                <Plus />
                Add a job
              </Button>
            }
            dialogBody={
              <div className="flex flex-col gap-4 ">
                <InputForm
                  control={control}
                  name="job.title"
                  placeholder="Title"
                />
                <InputForm
                  control={control}
                  name="job.company"
                  placeholder="Company"
                />
              </div>
            }
            btnLetf={
              <Button variant="outline" className="cursor-pointer">
                Remove Job
              </Button>
            }
            btnRight={
              <Button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 cursor-pointer"
              >
                Save
              </Button>
            }
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-gray-500">
              Your education
            </label>
            <SelectCard title="TLU" content="2026" selected />
          </div>
          <DialogForm
            dialogTitle="Add education"
            dialogTrigger={
              <Button variant="outline" className="w-full">
                <Plus />
                Add an institution
              </Button>
            }
            dialogBody={
              <div className="flex flex-col gap-4 ">
                <InputForm
                  control={control}
                  name="education.institution"
                  placeholder="Institution"
                />
                <SelectForm
                  name="birthDay"
                  control={control}
                  placeholder="Graduation Year"
                  options={yearOptions}
                  className="w-full "
                />
              </div>
            }
            btnRight={
              <Button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 cursor-pointer"
              >
                Save
              </Button>
            }
          />
        </div>
      </Form>
    </UpdateProfileCategory>
  );
};

export default WorkAndEducationForm;
