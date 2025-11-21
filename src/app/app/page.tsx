"use client";

import Layout from "@/components/layout";
import "swiper/css";
import "swiper/css/effect-creative";
import AuthGuard from "@/components/common/AuthGuard/AuthGuard";
import ListChatPartner from "../connections/components/ListChatPartner";
import Discover from "./components/Discover";
import ChatList from "../chat/components/ChatList";
import { Conversation, useChatStore } from "@/store/chat.store";
import { useEffect, useState } from "react";
import { getConversations } from "@/services/chat/chat.api";
import { useRouter } from "next/navigation";

export default function BumblePage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const {
    conversations,
    activeConversation,
    isConnected,
    setConversations,
    setActiveConversation,
    initializeSocket,
    disconnectSocket,
  } = useChatStore();

  useEffect(() => {
    // Load conversations
    loadConversations();

    // Cleanup on unmount
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <Layout
        asideChildren={
          <div className="w-full" onClick={() => router.push("/chat")}>
            <ChatList />
          </div>
        }
        mainChildren={<Discover />}
      ></Layout>
    </AuthGuard>
  );
}
