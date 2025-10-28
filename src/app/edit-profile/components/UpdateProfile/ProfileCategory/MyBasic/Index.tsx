"use client";

import {
  Ruler,
  Dumbbell,
  GraduationCap,
  Wine,
  Cigarette,
  Baby,
  Search,
  Star,
  Building,
  HandHeart,
  MapPin,
  Flag,
  Venus,
} from "lucide-react";
import { BasicInfoItem } from "./BasicInfoItem";
import UpdateProfileCategory from "..";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { JSX, useState } from "react";
import { DialogForm } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import SelectForm from "@/components/forms/SelectForm";
import { SelectCardList } from "./SelectCardList";
import { HeightSelector } from "./HeightSelector";
import { fieldConfigs } from "@/app/edit-profile/configs";

// Giả sử options cho từng field
const options = {
  height: ["150 cm", "155 cm", "160 cm", "165 cm", "170 cm"],
  exercise: ["Never", "Sometimes", "Often", "Everyday"],
  educationLevel: ["High school", "Bachelor", "Master", "PhD"],
  drinking: ["Never", "Socially", "Often"],
  smoking: ["Never", "Sometimes", "Often"],
  lookingFor: ["Friendship", "Relationship", "Marriage"],
  kids: ["No kids", "Have kids"],
  starSign: ["Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"],
  politics: ["Moderate", "Conservative", "Liberal"],
  religion: ["None", "Buddhism", "Christianity", "Islam"],
  gender: ["Male", "Female", "Other"],
  placesLived: ["Hanoi", "Ho Chi Minh", "Da Nang"],
  whereFrom: ["Hue", "Da Nang", "Can Tho"],
};

export function ProfileBasics() {
  const form = useForm<BasicProfileData>({
    defaultValues: {
      height: "155",
      exercise: "Sometimes",
      educationLevel: "High school",
      drinking: "Socially",
      smoking: "Never",
      lookingFor: "Marriage",
      kids: "No kids",
      starSign: "Leo",
      politics: "Moderate",
      religion: "Buddhism",
      gender: "Female",
      placesLived: "Hanoi",
      whereFrom: "Da Nang",
    },
  });

  const { control, getValues, handleSubmit } = form;
  const data = getValues();
  const [isActive, setIsActive] = useState(false);

  const onSubmit = (data: BasicProfileData) => {
    console.log("Saved:", data);
  };

  return (
    <UpdateProfileCategory
      title="My Basics"
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <Form {...form}>
        <div className="space-y-3">
          {fieldConfigs.map((item) => (
            <DialogForm
              key={item.key}
              dialogTrigger={
                <div>
                  <BasicInfoItem
                    icon={item.icon}
                    label={item.label}
                    value={data[item.key]}
                  />
                </div>
              }
              dialogBody={
                <div className="flex flex-col gap-4 mt-2 w-full">
                  {item.key === "height" ? (
                    <HeightSelector
                      control={control}
                      name="height"
                      // onSkip={onClose}
                    />
                  ) : (
                    <div className="w-full">
                      <div className="w-full mb-4 flex flex-col items-center justify-center gap-2 text-lg font-medium">
                        <item.icon className="text-rose-500 w-10 h-10" />
                        {item.question}
                      </div>
                      <SelectCardList
                        control={control}
                        name={item.key}
                        options={(options[item.key] || []).map((opt) => ({
                          label: opt,
                          value: opt,
                        }))}
                      />
                    </div>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Form>
    </UpdateProfileCategory>
  );
}
