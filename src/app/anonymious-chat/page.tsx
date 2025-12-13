"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth.store";
import { useAnonymousChatStore } from "@/store/anonymous-chat.store";
import AnonymousChatContainer from "./components/AnonymousChatContainer";
import ChatRoom from "./components/ChatRoom";
import MatchmakingScreen from "./components/MatchmakingScreen";

export default function AnonymousChatPage() {
  const { token, user } = useAuth();
  const { initializeSocket, disconnectSocket, currentRoom, matchingStatus } =
    useAnonymousChatStore();

  // Initialize socket on mount
  useEffect(() => {
    if (token && user?._id) {
      initializeSocket(token, user._id);
    }

    return () => {
      disconnectSocket();
    };
  }, [token, user?._id]);

  return (
    <AnonymousChatContainer>
      {currentRoom ? (
        <ChatRoom />
      ) : (
        <MatchmakingScreen isSearching={matchingStatus.isSearching} />
      )}
    </AnonymousChatContainer>
  );
}
