"use client";

import React, { useEffect, useState } from "react";
import UpdateImage from "./Image";
import { ChevronRight } from "lucide-react";
import { ProfilePromptsForm } from "./ProfileCategory/ProfilePromptsForm";
import AboutMeForm from "./ProfileCategory/AboutMeForm";
import WorkAndEducationForm from "./ProfileCategory/WorkAndEducationForm";
import { ProfileBasics } from "./ProfileCategory/MyBasic/Index";
import { getProfile } from "@/services/user/user.api";
import { Profile } from "../../types";

const UpdateProfile = () => {
  const [profile, setProfile] = useState<Profile>();

  const fetchProfile = async () => {
    const res = await getProfile();
    console.log("fetchProfile", res);
    setProfile(res);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  console.log("profile", profile);

  return (
    <div>
      <UpdateImage photos={profile?.photos}></UpdateImage>
      <div className="rounded-4xl border-1 py-2 px-4 mt-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
        <p>Preview Profile</p>
        <ChevronRight />
      </div>
      <ProfilePromptsForm prompts={profile?.prompts} />
      <AboutMeForm aboutMe={profile?.aboutMe || ""} />
      <WorkAndEducationForm jobsAndEducation={profile?.jobsAndEducation} />
      <ProfileBasics basic={profile?.basic} />
    </div>
  );
};

export default UpdateProfile;
