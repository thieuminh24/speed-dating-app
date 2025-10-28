import React from "react";
import UpdateImage from "./Image";
import { ChevronRight, ChevronDown } from "lucide-react";
import UpdateProfileCategory from "./ProfileCategory";
import { ProfilePromptsForm } from "./ProfileCategory/ProfilePromptsForm";
import AboutMeForm from "./ProfileCategory/AboutMeForm";
import WorkAndEducationForm from "./ProfileCategory/WorkAndEducationForm";
import { ProfileBasics } from "./ProfileCategory/MyBasic/Index";

const UpdateProfile = () => {
  return (
    <div>
      <UpdateImage></UpdateImage>
      <div className="rounded-4xl border-1 py-2 px-4 mt-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
        <p>Preview Profile</p>
        <ChevronRight />
      </div>
      <ProfilePromptsForm />
      <AboutMeForm />
      <WorkAndEducationForm />
      <ProfileBasics />
    </div>
  );
};

export default UpdateProfile;
