// src/app/chat/page.tsx - FIXED VERSION

"use client";

import { useEffect, useState } from "react";
import { useChatStore, Conversation } from "@/store/chat.store";
import { useAuth } from "@/store/auth.store";
import { getConversations } from "@/services/chat/chat.api";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import Layout from "@/components/layout";
import AuthGuard from "@/components/common/AuthGuard/AuthGuard";

export default function ChatPage() {
  const { token, user } = useAuth(); // ← Get user from auth
  const {
    conversations,
    activeConversation,
    isConnected,
    setConversations,
    setActiveConversation,
    initializeSocket,
    disconnectSocket,
  } = useChatStore();

  console.log("activeConversation", activeConversation);

  const [isLoading, setIsLoading] = useState(true);

  // Initialize socket & load conversations
  useEffect(() => {
    if (!token || !user) return;

    // ===== FIX: Pass user info to socket initialization =====
    initializeSocket(token, user);

    loadConversations();

    return () => {
      disconnectSocket();
    };
  }, [token, user]); // ← Add user dependency

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await getConversations();
      console.log("Loaded conversations:", data);
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  if (isLoading) {
    return (
      <Layout
        asideChildren={<div />}
        mainChildren={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        }
      />
    );
  }

  return (
    <AuthGuard>
      <Layout
        asideChildren={
          <div className="w-full h-full">
            <ChatList onSelectConversation={handleSelectConversation} />
          </div>
        }
        mainChildren={
          <div className="flex w-full h-full">
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 w-full">
                <MessageSquare size={64} className="mb-4 opacity-50" />
                <p className="text-lg">
                  Select a conversation to start chatting
                </p>
              </div>
            )}
          </div>
        }
      />
    </AuthGuard>
  );
}
