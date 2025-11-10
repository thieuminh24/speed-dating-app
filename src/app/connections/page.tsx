// app/chat/page.tsx
"use client";

import Layout from "@/components/layout";
import AuthGuard from "@/components/common/AuthGuard/AuthGuard";
import ListChatPartner from "./components/ListChatPartner";
import ChatBox from "./components/ChatBox";

export default function ChatPage() {
  return (
    <AuthGuard>
      <Layout asideChildren={<ListChatPartner />} mainChildren={<ChatBox />} />
    </AuthGuard>
  );
}
