"use client";

import { Form, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, PenLine } from "lucide-react";
import UpdateProfileCategory from ".";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import TextareaForm from "@/components/forms/TextareaForm";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Prompt = { title: string; answer: string };
type FormData = { prompts: Prompt[] };

export function ProfilePromptsForm() {
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selected, setSelected] = useState("");

  const form = useForm<FormData>({
    defaultValues: {
      prompts: [],
    },
  });

  const { control } = form;
  const prompts = useWatch({ control, name: "prompts" });

  const allOptions = [
    {
      value: "I'll know we vibe on a date if",
      label: "I'll know we vibe on a date if",
    },
    {
      value: "If I could bring back one trend, it would be",
      label: "If I could bring back one trend, it would be",
    },
    { value: "Low-key, I think I", label: "Low-key, I think I" },
    {
      value: "The most spontaneous thing I've done",
      label: "The most spontaneous thing I've done",
    },
    {
      value: "My biggest irrational fear",
      label: "My biggest irrational fear",
    },
  ];

  const usedTitles = prompts.map((p) => p.title);
  const availableOptions = allOptions.filter(
    (opt) => !usedTitles.includes(opt.value),
  );

  const { append } = useFieldArray({
    control: control,
    name: "prompts",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setEditingIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPrompt = (value: string) => {
    setSelected(value);
    append({ title: value, answer: "" });
  };

  return (
    <UpdateProfileCategory
      title={"My Profile Prompts"}
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <div ref={containerRef}>
        <Form {...form}>
          {prompts.map((prompt, index) => (
            <FormItem
              key={index}
              className="border rounded-xl px-3 mb-3 bg-white mt-4"
            >
              <div className="flex items-center justify-between mt-2">
                <h3 className="font-medium text-rose-400 text-[12px]">
                  {prompt.title}
                </h3>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 "
                  onClick={() => setEditingIndex(index)}
                >
                  {editingIndex !== index && <PenLine size={16} className="" />}
                </Button>
              </div>
              {editingIndex === index ? (
                <TextareaForm
                  control={control}
                  name={`prompts.${index}.answer`}
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none max-w-[374px]"
                  maxlength={160}
                />
              ) : (
                <div className="px-4 pb-4">{prompt.answer}</div>
              )}
            </FormItem>
          ))}
          {availableOptions.length !== 0 && (
            <div className="w-full flex items-center justify-center">
              <div className="flex flex-col gap-3 bg-white rounded-xl ">
                <Select onValueChange={handleSelectPrompt}>
                  <SelectTrigger className="w-[280px]">
                    <Plus className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Add a prompt" />
                  </SelectTrigger>

                  <SelectContent>
                    {availableOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Form>
      </div>
    </UpdateProfileCategory>
  );
}
