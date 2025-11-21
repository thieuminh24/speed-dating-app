import ActionSwiper from "@/app/app/components/ActionSwiper";
import CardInfo from "@/app/app/components/CardInfo";
import { Profile } from "@/app/edit-profile/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";

const PreviewProfile = ({ profile }: { profile: Profile | null }) => {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-4xl border-1 py-2 px-4 mt-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setIsCardOpen(true)}
      >
        <p>Preview Profile</p>
        <ChevronRight />
      </div>
      <Dialog open={isCardOpen}>
        <DialogContent
          className="
      w-full 
      max-w-lg 
      sm:max-w-xl 
      md:max-w-3xl 
      lg:max-w-6xl 
      h-[85vh] 
      p-0 
      overflow-hidden 
      rounded-3xl
    "
          style={{ zIndex: 1000 }}
        >
          {profile && (
            <>
              <CardInfo data={profile} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreviewProfile;
