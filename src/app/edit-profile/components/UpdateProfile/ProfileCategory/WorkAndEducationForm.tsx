"use client";

import React, { useState } from "react";
import UpdateProfileCategory from ".";
import { DialogForm } from "@/components/common/Dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const WorkAndEducationForm = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <UpdateProfileCategory
      title={"My Work & Education"}
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    >
      <div className="flex flex-col gap-6">
        <DialogForm
          triggerElement={
            <Button variant="outline" className="w-full">
              <Plus />
              Add a job
            </Button>
          }
        />
        <DialogForm
          triggerElement={
            <Button variant="outline" className="w-full">
              <Plus />
              Add a job
            </Button>
          }
        />
      </div>
    </UpdateProfileCategory>
  );
};

export default WorkAndEducationForm;
