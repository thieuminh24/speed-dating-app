"use client";

import { BasicInfoItem } from "./BasicInfoItem";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { DialogForm } from "@/components/common/Dialog";
import { SelectCardList } from "./SelectCardList";
import { HeightSelector } from "./HeightSelector";
import { fieldConfigs } from "@/app/edit-profile/configs";
import UpdateProfileCategory from "..";
import { updateUser } from "@/services/user/user.api";
import { BasicProfileType } from "@/app/edit-profile/types";
import {
  Drinking,
  EducationLevel,
  Exercise,
  Gender,
  Kids,
  LookingFor,
  Politics,
  Religion,
  Smoking,
  StarSign,
} from "@/app/edit-profile/enums";
import { vietnamProvinces } from "@/services/location/vietnam-provinces";

// Import enums

// Map enum → options cho SelectCardList
const enumToOptions = <T extends Record<string, string>>(enumObj: T) =>
  Object.values(enumObj).map((value) => ({
    label: value,
    value,
  }));

const optionsMap = {
  exercise: enumToOptions(Exercise),
  educationLevel: enumToOptions(EducationLevel),
  drinking: enumToOptions(Drinking),
  smoking: enumToOptions(Smoking),
  lookingFor: enumToOptions(LookingFor),
  kids: enumToOptions(Kids),
  starSign: enumToOptions(StarSign),
  politics: enumToOptions(Politics),
  religion: enumToOptions(Religion),
  gender: enumToOptions(Gender),
  // placesLived & whereFrom: giả sử là string tự do → dùng input sau
  placesLived: vietnamProvinces.map((p) => ({ label: p.name, value: p.name })),
  whereFrom: vietnamProvinces.map((p) => ({ label: p.name, value: p.name })),
};

interface ProfileBasicsProps {
  basic?: BasicProfileType;
}

export function ProfileBasics({ basic = {} }: ProfileBasicsProps) {
  const [isActive, setIsActive] = useState(false);

  const form = useForm<BasicProfileType>({
    defaultValues: {
      height: basic.height,
      exercise: basic.exercise ?? undefined,
      educationLevel: basic.educationLevel ?? undefined,
      drinking: basic.drinking ?? undefined,
      smoking: basic.smoking ?? undefined,
      lookingFor: basic.lookingFor ?? undefined,
      kids: basic.kids ?? undefined,
      starSign: basic.starSign ?? undefined,
      politics: basic.politics ?? undefined,
      religion: basic.religion ?? undefined,
      gender: basic.gender || "",
      placesLived: basic.placesLived || "",
      whereFrom: basic.whereFrom || "",
    },
  });

  const { control, watch, reset } = form;
  const data = watch();

  // Reset khi basic từ server thay đổi
  useEffect(() => {
    reset({
      height: basic.height,
      exercise: basic.exercise ?? undefined,
      educationLevel: basic.educationLevel ?? undefined,
      drinking: basic.drinking ?? undefined,
      smoking: basic.smoking ?? undefined,
      lookingFor: basic.lookingFor ?? undefined,
      kids: basic.kids ?? undefined,
      starSign: basic.starSign ?? undefined,
      politics: basic.politics ?? undefined,
      religion: basic.religion ?? undefined,
      gender: basic.gender ?? undefined,
      placesLived: basic.placesLived ?? undefined,
      whereFrom: basic.whereFrom ?? undefined,
    });
  }, [basic, reset]);

  // Lưu tự động khi có thay đổi
  useEffect(() => {
    const hasChanged =
      JSON.stringify(data) !==
      JSON.stringify({
        height: basic.height?.toString() || "",
        exercise: basic.exercise || "",
        educationLevel: basic.educationLevel || "",
        drinking: basic.drinking || "",
        smoking: basic.smoking || "",
        lookingFor: basic.lookingFor || "",
        kids: basic.kids || "",
        starSign: basic.starSign || "",
        politics: basic.politics || "",
        religion: basic.religion || "",
        gender: basic.gender || "",
        placesLived: basic.placesLived || "",
        whereFrom: basic.whereFrom || "",
      });

    if (!hasChanged) return;

    const timeout = setTimeout(() => {
      const payload: Partial<BasicProfileType> = { ...data };
      if (payload.height) payload.height = Number(payload.height);
      updateUser({ basic: payload }).catch(console.error);
    }, 600);

    return () => clearTimeout(timeout);
  }, [data, basic]);

  return (
    <UpdateProfileCategory
      title="My Basics"
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <Form {...form}>
        <div className="space-y-3">
          {fieldConfigs.map((item) => {
            const fieldKey = item.key as keyof BasicProfileType;
            const value = data[fieldKey] as BasicProfileType;

            return (
              <DialogForm
                key={item.key}
                dialogTrigger={
                  <div>
                    <BasicInfoItem
                      icon={item.icon}
                      label={item.label}
                      value={value || "Not set"}
                    />
                  </div>
                }
                dialogBody={
                  <div className="flex flex-col gap-4 mt-2 w-full">
                    {item.key === "placesLived" || item.key === "whereFrom" ? (
                      <div className="w-full">
                        <div className="w-full mb-4 flex flex-col items-center justify-center gap-2 text-lg font-medium">
                          <item.icon className="text-rose-500 w-10 h-10" />
                          {item.question}
                        </div>
                        <SelectCardList
                          control={control}
                          name={item.key}
                          options={
                            optionsMap[item.key as keyof typeof optionsMap] ||
                            []
                          }
                        />
                      </div>
                    ) : item.key === "height" ? (
                      <HeightSelector control={control} name="height" />
                    ) : (
                      <div className="w-full">
                        <div className="w-full mb-4 flex flex-col items-center justify-center gap-2 text-lg font-medium">
                          <item.icon className="text-rose-500 w-10 h-10" />
                          {item.question}
                        </div>
                        <SelectCardList
                          control={control}
                          name={item.key}
                          options={
                            optionsMap[item.key as keyof typeof optionsMap] ||
                            []
                          }
                        />
                      </div>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      </Form>
    </UpdateProfileCategory>
  );
}
