// src/hooks/useAnonymousChat.ts
"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth.store";
import { useAnonymousChatStore } from "@/store/anonymous-chat.store";
import {
  getAnonymousMessages,
  getCurrentRoom,
} from "@/services/anonymous-chat/anonymous-chat.api";

/**
 * Custom hook to manage anonymous chat
 * Auto-connects socket and loads current room on mount
 */
export function useAnonymousChat() {
  const { token, user } = useAuth();
  const {
    initializeSocket,
    disconnectSocket,
    currentRoom,
    messages,
    matchingStatus,
    isConnected,
    isPartnerTyping,
    isPartnerDisconnected,
    startMatching,
    cancelMatching,
    sendMessage,
    leaveRoom,
    setCurrentRoom,
    setMessages,
  } = useAnonymousChatStore();

  // Initialize socket connection
  useEffect(() => {
    if (token && user?._id) {
      initializeSocket(token, user._id);

      // Load current room if exists
      loadCurrentRoom();
    }

    return () => {
      disconnectSocket();
    };
  }, [token, user?._id]);

  // Load current room from API
  const loadCurrentRoom = async () => {
    try {
      const response = await getCurrentRoom();
      if (response.hasActiveRoom && response.room) {
        setCurrentRoom(response.room);

        // Load messages
        loadMessages(response.room.roomId);
      }
    } catch (error) {
      console.error("Failed to load current room:", error);
    }
  };

  // Load messages for a room
  const loadMessages = async (roomId: string) => {
    try {
      const response = await getAnonymousMessages(roomId, 1, 50);
      setMessages(response.messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  // Refresh current room info
  const refreshRoom = async () => {
    if (currentRoom) {
      await loadMessages(currentRoom.roomId);
    }
  };

  return {
    // State
    currentRoom,
    messages,
    matchingStatus,
    isConnected,
    isPartnerTyping,
    isPartnerDisconnected,

    // Actions
    startMatching,
    cancelMatching,
    sendMessage,
    leaveRoom,
    refreshRoom,
    loadMessages,
  };
}

/**
 * Hook to check if user has active anonymous chat
 * Useful for showing notifications or badges
 */
export function useHasActiveAnonymousChat() {
  const { currentRoom } = useAnonymousChatStore();
  return !!currentRoom && currentRoom.status === "active";
}

/**
 * Hook to track unread anonymous messages
 * Could be extended to show unread count
 */
export function useAnonymousChatNotifications() {
  const { currentRoom, messages } = useAnonymousChatStore();

  const hasActiveRoom = !!currentRoom;
  const messageCount = messages.length;

  return {
    hasActiveRoom,
    messageCount,
  };
}
