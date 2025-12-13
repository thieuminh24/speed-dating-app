// src/app/app/components/MatchModal.tsx
"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { createConversationFromMatch } from "@/services/chat/chat.api";
import { useState } from "react";
import QuizInviteButton from "@/app/quiz/components/QuizInviteButton";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: {
    matchId: string;
    matchedUser: {
      _id: string;
      name: string;
      photos: string[];
    };
  } | null;
}

export default function MatchModal({
  isOpen,
  onClose,
  matchData,
}: MatchModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!matchData) return null;

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      // Create conversation from match
      await createConversationFromMatch(matchData.matchId);

      // Navigate to chat page
      router.push("/chat");
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-rose-50 to-pink-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center py-8">
          {/* Hearts animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mb-6"
          >
            <Heart className="text-rose-500 fill-rose-500" size={64} />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-rose-600 mb-2"
          >
            It's a Match!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-8"
          >
            You and {matchData.matchedUser.name} liked each other
          </motion.p>

          {/* User avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-8"
          >
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
              <AvatarImage
                src={matchData.matchedUser.photos[0]}
                alt={matchData.matchedUser.name}
              />
              <AvatarFallback className="text-2xl">
                {matchData.matchedUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3 w-full"
          >
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-6 text-lg"
            >
              <MessageCircle className="mr-2" />
              {isLoading ? "Loading..." : "Send Message"}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              Keep Swiping
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
