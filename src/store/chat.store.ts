// src/store/chat.store.ts - COMPLETE FIXED VERSION
import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { toast } from "@/hook/useToast";

export interface Message {
  _id: string;
  type: "text" | "image" | "file" | "quiz_invite";
  content?: string;
  fileUrl?: string;
  fileName?: string;
  quizSessionId?: string;
  sender: {
    _id: string;
    name: string;
    photos: string[];
  };
  isMine: boolean;
  reactions: Array<{
    userId: string;
    userName: string;
    emoji: string;
  }>;
  readStatus?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  matchId: string;
  partner: {
    _id: string;
    name: string;
    photos: string[];
    lastActive?: Date;
  };
  lastMessage?: {
    _id: string;
    content?: string;
    type: string;
    isMine: boolean;
    createdAt: string;
  };
  unreadCount: number;
  status: string;
  lastMessageAt?: string;
}

interface TypingUser {
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface ChatStore {
  socket: Socket | null;
  isConnected: boolean;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, TypingUser>;
  onlineUsers: Set<string>;

  // Match notifications
  matchNotifications: Array<{
    matchId: string;
    matchedUser: {
      _id: string;
      name: string;
      photos: string[];
    };
  }>;

  // Actions
  initializeSocket: (token: string, currentUser?: { _id: string }) => void;
  disconnectSocket: () => void;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageReactions: (
    conversationId: string,
    messageId: string,
    reactions: Message["reactions"],
  ) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;

  // Socket events
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (data: {
    conversationId: string;
    type: string;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    quizSessionId?: string;
  }) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  deleteMessageSocket: (messageId: string) => void;
  unmatchUser: (conversationId: string) => void;
  blockUser: (conversationId: string, userId: string) => void;

  // Match notifications
  addMatchNotification: (data: {
    matchId: string;
    matchedUser: { _id: string; name: string; photos: string[] };
  }) => void;
  clearMatchNotifications: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  socket: null,
  isConnected: false,
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  matchNotifications: [],

  initializeSocket: (token: string, currentUser?: { _id: string }) => {
    const socket = io("http://localhost:4000/chat", {
      auth: { token },
      transports: ["websocket"],
    });

    // Store user reference
    let user = currentUser;

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      set({ isConnected: false });
    });

    // ===== MATCH NOTIFICATION =====
    socket.on("match:created", (data) => {
      console.log("🎉 Match notification received:", data);

      get().addMatchNotification(data);

      toast({
        title: "It's a Match! 💕",
        description: `You matched with ${data.matchedUser.name}!`,
        duration: 5000,
      });
    });

    // ===== NEW MESSAGE =====
    socket.on("message:new", (data) => {
      console.log("📨 New message:", data);

      const { conversationId, message } = data;

      // Use stored user reference to set isMine
      get().addMessage(conversationId, {
        ...message,
        isMine: message.sender._id === user?._id,
        reactions: message.reactions || [],
      });

      // Update conversation's last message
      const conversations = get().conversations.map((conv) =>
        conv._id === conversationId
          ? {
              ...conv,
              lastMessage: {
                _id: message._id,
                content: message.content,
                type: message.type,
                isMine: message.sender._id === user?._id,
                createdAt: message.createdAt,
              },
              unreadCount:
                get().activeConversation?._id === conversationId
                  ? conv.unreadCount
                  : conv.unreadCount + 1,
              lastMessageAt: message.createdAt,
            }
          : conv,
      );

      // Sort conversations by lastMessageAt
      const sorted = conversations.sort((a, b) => {
        const dateA = new Date(a.lastMessageAt || 0).getTime();
        const dateB = new Date(b.lastMessageAt || 0).getTime();
        return dateB - dateA;
      });

      set({ conversations: sorted });
    });

    // ===== TYPING INDICATOR =====
    socket.on("typing:update", (data) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [data.conversationId]: {
            userId: data.userId,
            userName: data.userName || "Someone",
            isTyping: data.isTyping,
          },
        },
      }));
    });

    // ===== MESSAGE REACTIONS =====
    socket.on("message:reaction", (data) => {
      console.log("👍 Reaction update:", data);
      get().updateMessageReactions(
        data.conversationId,
        data.messageId,
        data.reactions,
      );
    });

    // ===== MESSAGE DELETED =====
    socket.on("message:deleted", (data) => {
      console.log("🗑️ Message deleted:", data);
      get().deleteMessage(data.conversationId, data.messageId);
    });

    // ===== USER ONLINE/OFFLINE =====
    socket.on("user:online", (data) => {
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.add(data.userId);
        return { onlineUsers: newOnlineUsers };
      });
    });

    socket.on("user:offline", (data) => {
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(data.userId);
        return { onlineUsers: newOnlineUsers };
      });
    });

    // ===== CONVERSATION UNMATCHED =====
    socket.on("conversation:unmatched", (data) => {
      toast({
        title: "Unmatched",
        description: "You have been unmatched",
        variant: "destructive",
      });

      // Remove conversation
      set((state) => ({
        conversations: state.conversations.filter(
          (c) => c._id !== data.conversationId,
        ),
        activeConversation:
          state.activeConversation?._id === data.conversationId
            ? null
            : state.activeConversation,
      }));
    });

    // ===== USER BLOCKED =====
    socket.on("user:blocked", (data) => {
      toast({
        title: "Blocked",
        description: "You have been blocked",
        variant: "destructive",
      });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
      };
    }),

  updateMessageReactions: (conversationId, messageId, reactions) =>
    set((state) => {
      const conversationMessages = state.messages[conversationId] || [];
      const updatedMessages = conversationMessages.map((msg) =>
        msg._id === messageId ? { ...msg, reactions } : msg,
      );
      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
      };
    }),

  deleteMessage: (conversationId, messageId) =>
    set((state) => {
      const conversationMessages = state.messages[conversationId] || [];
      const updatedMessages = conversationMessages.filter(
        (msg) => msg._id !== messageId,
      );
      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
      };
    }),

  // ===== SOCKET ACTIONS =====

  joinConversation: (conversationId) => {
    const { socket } = get();
    socket?.emit("conversation:join", { conversationId });
  },

  leaveConversation: (conversationId) => {
    const { socket } = get();
    socket?.emit("conversation:leave", { conversationId });
  },

  sendMessage: (data) => {
    const { socket } = get();
    socket?.emit("message:send", data);
  },

  startTyping: (conversationId) => {
    const { socket } = get();
    socket?.emit("typing:start", { conversationId });
  },

  stopTyping: (conversationId) => {
    const { socket } = get();
    socket?.emit("typing:stop", { conversationId });
  },

  reactToMessage: (messageId, emoji) => {
    const { socket } = get();
    socket?.emit("message:react", { messageId, emoji });
  },

  deleteMessageSocket: (messageId) => {
    const { socket } = get();
    socket?.emit("message:delete", { messageId });
  },

  unmatchUser: (conversationId) => {
    const { socket } = get();
    socket?.emit("conversation:unmatch", { conversationId });
  },

  blockUser: (conversationId, userId) => {
    const { socket } = get();
    socket?.emit("user:block", { conversationId, userId });
  },

  // ===== MATCH NOTIFICATIONS =====

  addMatchNotification: (data) =>
    set((state) => ({
      matchNotifications: [...state.matchNotifications, data],
    })),

  clearMatchNotifications: () => set({ matchNotifications: [] }),
}));
