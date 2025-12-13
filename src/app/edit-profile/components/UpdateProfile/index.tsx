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
import PreviewProfile from "./ProfileCategory/PreviewProfile";
import { mapApiUserToUser } from "@/app/app/components/Discover";
import { VerificationButton } from "../Verification/VerificationButton";

const UpdateProfile = () => {
  const [profile, setProfile] = useState<Profile>();

  const fetchProfile = async () => {
    const res = await getProfile();
    const mappedUser = mapApiUserToUser(res);
    setProfile(mappedUser);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <UpdateImage photos={profile?.photos}></UpdateImage>
      <PreviewProfile profile={profile || null} />
      <div className="px-4">
        <VerificationButton />
      </div>
      <ProfilePromptsForm prompts={profile?.prompts || []} />
      <AboutMeForm aboutMe={profile?.aboutMe || ""} />
      <WorkAndEducationForm jobsAndEducation={profile?.jobsAndEducation} />
      <ProfileBasics basic={profile?.basic} />
    </div>
  );
};

export default UpdateProfile;
