// src/app/chat/components/QuizInviteButtonChat.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import userService from "@/services/config";

interface QuizInviteButtonChatProps {
  conversationId: string;
  matchId: string;
}

export default function QuizInviteButtonChat({
  conversationId,
  matchId,
}: QuizInviteButtonChatProps) {
  const [sending, setSending] = useState(false);

  const handleSendQuizInvite = async () => {
    setSending(true);
    try {
      await userService.post("/quiz/sessions", {
        matchId,
        conversationId, // ← Send via chat
      });

      alert("Quiz invitation sent! 🎉");
    } catch (error: any) {
      console.error("Failed to send quiz invite:", error);
      alert(error.response?.data?.message || "Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleSendQuizInvite}
      disabled={sending}
      className="border-purple-200 hover:bg-purple-50"
      title="Send Quiz Invite"
    >
      {sending ? (
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
      ) : (
        <Brain className="w-5 h-5 text-purple-500" />
      )}
    </Button>
  );
}
