// src/components/MatchNotificationListener.tsx
"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chat.store";
import MatchModal from "@/app/app/components/MatchModal";

export default function MatchNotificationListener() {
  const { matchNotifications, clearMatchNotifications } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);

  useEffect(() => {
    if (matchNotifications.length > 0) {
      // Show first notification
      setCurrentMatch(matchNotifications[0]);
      setIsOpen(true);
    }
  }, [matchNotifications]);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentMatch(null);
    // Remove shown notification
    clearMatchNotifications();
  };

  if (!currentMatch) return null;

  return (
    <MatchModal
      isOpen={isOpen}
      onClose={handleClose}
      matchData={currentMatch}
    />
  );
}
