"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PenLine, Plus } from "lucide-react";
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
import UpdateProfileCategory from ".";
import { updateUser } from "@/services/user/user.api";

type Prompt = { prompt: string; answer: string };
type FormData = { prompts: Prompt[] };

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
  { value: "My biggest irrational fear", label: "My biggest irrational fear" },
] as const;

interface ProfilePromptsFormProps {
  prompts: Prompt[]; // existing prompts from the server / parent
}

export function ProfilePromptsForm({ prompts = [] }: ProfilePromptsFormProps) {
  const [isActive, setIsActive] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const form = useForm<FormData>({
    defaultValues: {
      prompts,
    },
  });

  const { control, handleSubmit, reset, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prompts",
  });

  useEffect(() => {
    if (prompts && prompts.length > 0) {
      reset({ prompts });
    }
  }, [prompts, reset]);
  // Watch the current prompts so we can compute available options
  const currentPrompts = useWatch({ control, name: "prompts" }) ?? [];
  console.log("currentPrompts", currentPrompts);

  const usedTitles = currentPrompts.map((p) => p.prompt);
  const availableOptions = allOptions.filter(
    (opt) => !usedTitles.includes(opt.value),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Click-outside to stop editing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditingIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPrompt = (value: string) => {
    append({ prompt: value, answer: "" });
    // optionally auto-focus the new textarea
    setEditingIndex(currentPrompts.length); // length before append → correct index after
  };

  const onFormSubmit = async (data: FormData) => {
    await updateUser(data);
    // you could also save to an API here
  };

  return (
    <UpdateProfileCategory
      title="My Profile Prompts"
      isActive={isActive}
      onClick={() => setIsActive((v) => !v)}
    >
      <div ref={containerRef}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id} // important: use field.id from useFieldArray
                className="border rounded-xl bg-white p-4 mt-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-rose-400 text-sm font-medium">
                    {currentPrompts[index]?.prompt}
                  </h3>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIndex(index)}
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        remove(index);
                        if (editingIndex === index) setEditingIndex(-1);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                {editingIndex === index ? (
                  <TextareaForm
                    control={control}
                    name={`prompts.${index}.answer`}
                    placeholder="Your answer..."
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none resize-none"
                    maxlength={160}
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {currentPrompts[index]?.answer || (
                      <span className="text-gray-400">No answer yet</span>
                    )}
                  </p>
                )}
              </div>
            ))}

            {/* Add new prompt */}
            {availableOptions.length > 0 && (
              <div className="flex justify-center mt-6">
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
            )}

            {/* Optional save button */}
            {fields.length > 0 && (
              <div className="flex justify-end mt-6">
                <Button type="submit">Save Prompts</Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </UpdateProfileCategory>
  );
}
