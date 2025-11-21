// src/app/bumble/components/UserDetailModal.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import CardInfo from "./CardInfo";
import { Profile } from "@/app/edit-profile/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onPass?: () => void;
  onLike?: () => void;
}

export const UserDetailModal = ({
  open,
  onOpenChange,
  user,
  onPass,
  onLike,
}: Props) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
        <CardInfo data={user} />
      </DialogContent>
    </Dialog>
  );
};
