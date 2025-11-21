// src/components/quiz/QuizInviteButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createQuizSession } from "@/services/quiz/quiz.api";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface QuizInviteButtonProps {
  matchId: string;
  partnerName: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function QuizInviteButton({
  matchId,
  partnerName,
  variant = "outline",
  size = "default",
  className = "",
}: QuizInviteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const result = await createQuizSession(matchId);

      // Navigate to quiz page
      router.push(`/quiz/${result.sessionId}`);
    } catch (error: any) {
      console.error("Failed to create quiz:", error);
      alert(error.response?.data?.message || "Failed to create quiz");
    } finally {
      setCreating(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowConfirm(true)}
        className={`flex items-center gap-2 ${className}`}
      >
        <Brain size={20} />
        Take Quiz
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-rose-500" />
              Start Compatibility Quiz?
            </DialogTitle>
            <DialogDescription className="pt-4">
              You're about to invite <strong>{partnerName}</strong> to take a
              compatibility quiz together.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4"
          >
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                What to expect:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">📝</span>
                  <span>
                    10 fun questions about personality, lifestyle, and interests
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎯</span>
                  <span>Both of you answer independently</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💕</span>
                  <span>
                    See your compatibility score and what you have in common!
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={creating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={16} />
                    Start Quiz
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
