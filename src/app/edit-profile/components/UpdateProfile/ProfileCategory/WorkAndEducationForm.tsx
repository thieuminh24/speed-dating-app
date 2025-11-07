"use client";

import React, { useState, useEffect } from "react";
import { DialogForm } from "@/components/common/Dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputForm from "@/components/forms/InputForm";
import { Form } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { yearOptions } from "@/constants/date-options.constant";
import SelectForm from "@/components/forms/SelectForm";
import { SelectCard } from "@/components/common/SelectCard";
import UpdateProfileCategory from ".";
import { updateUser } from "@/services/user/user.api";
import { jobsAndEducationType } from "@/app/edit-profile/types";

interface WorkAndEducationFormProps {
  jobsAndEducation?: jobsAndEducationType;
}

const WorkAndEducationForm: React.FC<WorkAndEducationFormProps> = ({
  jobsAndEducation = { jobs: [], education: [] },
}) => {
  const [isActive, setIsActive] = useState(false);

  // Form với type chính xác
  const form = useForm<
    jobsAndEducationType & {
      newJob: { title: string; company: string };
      newEdu: { institution: string; graduation: string };
    }
  >({
    defaultValues: {
      ...jobsAndEducation,
      newJob: { title: "", company: "" },
      newEdu: { institution: "", graduation: "" },
    },
  });

  const { control, reset, watch, setValue, getValues } = form;

  const {
    fields: jobFields,
    append: appendJob,
    remove: removeJob,
  } = useFieldArray({
    control,
    name: "jobs",
  });

  const { fields: eduFields, append: appendEdu } = useFieldArray({
    control,
    name: "education",
  });

  // Reset khi dữ liệu từ server thay đổi
  useEffect(() => {
    reset({
      ...jobsAndEducation,
      newJob: { title: "", company: "" },
      newEdu: { institution: "", graduation: "" },
    });
  }, [jobsAndEducation, reset]);

  // Theo dõi thay đổi (chỉ jobs & education)
  const watchedJobs = watch("jobs");
  const watchedEdu = watch("education");
  const hasChanged =
    JSON.stringify(watchedJobs) !== JSON.stringify(jobsAndEducation.jobs) ||
    JSON.stringify(watchedEdu) !== JSON.stringify(jobsAndEducation.education);

  // Lưu tự động
  useEffect(() => {
    if (!hasChanged) return;

    const timeout = setTimeout(() => {
      updateUser({
        jobsAndEducation: {
          jobs: watchedJobs,
          education: watchedEdu,
        },
      }).catch(console.error);
    }, 800);

    return () => clearTimeout(timeout);
  }, [watchedJobs, watchedEdu, hasChanged]);

  return (
    <UpdateProfileCategory
      title="My Work & Education"
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <Form {...form}>
        <div className="flex flex-col gap-6">
          {/* === JOBS === */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-500">Your Job</label>
            {jobFields.map((job, index) => (
              <SelectCard
                key={job.id}
                title={job.title}
                content={job.company}
                selected
                onRemove={() => removeJob(index)}
              />
            ))}
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
              <div className="flex flex-col gap-4">
                <InputForm
                  control={control}
                  name="newJob.title"
                  placeholder="Title"
                />
                <InputForm
                  control={control}
                  name="newJob.company"
                  placeholder="Company"
                />
              </div>
            }
            btnRight={
              <Button
                type="button"
                className="bg-rose-500 hover:bg-rose-600 cursor-pointer"
                onClick={() => {
                  const { title, company } = getValues("newJob");
                  if (title && company) {
                    appendJob({ title, company });
                    setValue("newJob", { title: "", company: "" });
                  }
                }}
              >
                Save
              </Button>
            }
          />

          {/* === EDUCATION === */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-500">Your education</label>
            {eduFields.map((edu, index) => (
              <SelectCard
                key={edu.id}
                title={edu.institution}
                content={edu.graduation?.toString()}
                selected
              />
            ))}
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
              <div className="flex flex-col gap-4">
                <InputForm
                  control={control}
                  name="newEdu.institution"
                  placeholder="Institution"
                />
                <SelectForm
                  name="newEdu.graduation"
                  control={control}
                  placeholder="Graduation Year"
                  options={yearOptions}
                  className="w-full"
                />
              </div>
            }
            btnRight={
              <Button
                type="button"
                className="bg-rose-500 hover:bg-rose-600 cursor-pointer"
                onClick={() => {
                  const { institution, graduation } = getValues("newEdu");
                  if (institution && graduation) {
                    appendEdu({
                      institution,
                      graduation: Number(graduation),
                    });
                    setValue("newEdu", { institution: "", graduation: "" });
                  }
                }}
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
