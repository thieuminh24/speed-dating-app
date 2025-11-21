// src/store/chat.store.ts
import { create } from "zustand";
import { socketManager } from "@/lib/socket";

export type MessageType = "text" | "image" | "file";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  _id: string;
  type: MessageType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  sender: {
    _id: string;
    name: string;
    photos: string[];
  };
  isMine: boolean;
  reactions?: Array<{
    userId: string;
    userName: string;
    emoji: string;
  }>;
  readStatus?: MessageStatus;
  createdAt: string;
  replyTo?: any;
}

export interface Conversation {
  _id: string;
  matchId: string;
  partner: {
    _id: string;
    name: string;
    photos: string[];
    lastActive?: string;
  };
  lastMessage?: {
    _id: string;
    content: string;
    type: MessageType;
    isMine: boolean;
    createdAt: string;
  };
  unreadCount: number;
  status: "active" | "archived" | "blocked";
  lastMessageAt?: string;
}

export interface TypingStatus {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface ChatState {
  // State
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, TypingStatus>;
  onlineUsers: Set<string>;
  isConnected: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>,
  ) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  markAsRead: (conversationId: string) => void;
  setTyping: (typing: TypingStatus) => void;
  clearTyping: (conversationId: string) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setConnected: (connected: boolean) => void;
  clearChat: () => void;

  // Socket Actions
  initializeSocket: (token: string) => void;
  disconnectSocket: () => void;
  joinConversation: (conversationId: string) => void;
  sendMessage: (data: {
    conversationId: string;
    type: MessageType;
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  deleteMessageSocket: (messageId: string) => void;
  unmatchUser: (conversationId: string) => void;
  blockUser: (conversationId: string, userId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial State
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  isConnected: false,

  // State Actions
  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId
          ? {
              ...conv,
              lastMessage: {
                _id: message._id,
                content: message.content || "Sent an attachment",
                type: message.type,
                isMine: message.isMine,
                createdAt: message.createdAt,
              },
              unreadCount: message.isMine
                ? conv.unreadCount
                : conv.unreadCount + 1,
            }
          : conv,
      ),
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  updateMessage: (conversationId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: state.messages[conversationId]?.map((msg) =>
          msg._id === messageId ? { ...msg, ...updates } : msg,
        ),
      },
    })),

  deleteMessage: (conversationId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: state.messages[conversationId]?.filter(
          (msg) => msg._id !== messageId,
        ),
      },
    })),

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    })),

  setTyping: (typing) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [typing.conversationId]: typing,
      },
    })),

  clearTyping: (conversationId) =>
    set((state) => {
      const newTyping = { ...state.typingUsers };
      delete newTyping[conversationId];
      return { typingUsers: newTyping };
    }),

  setUserOnline: (userId) =>
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
    })),

  setUserOffline: (userId) =>
    set((state) => {
      const newOnline = new Set(state.onlineUsers);
      newOnline.delete(userId);
      return { onlineUsers: newOnline };
    }),

  setConnected: (connected) => set({ isConnected: connected }),

  clearChat: () =>
    set({
      conversations: [],
      activeConversation: null,
      messages: {},
      typingUsers: {},
      onlineUsers: new Set(),
      isConnected: false,
    }),

  // Socket Actions
  initializeSocket: (token) => {
    const socket = socketManager.connect(token);
    set({ isConnected: true });

    // Listen to events
    socket.on(
      "message:new",
      (data: { conversationId: string; message: any }) => {
        // Get current user ID from auth store to set isMine correctly
        const currentUserId = localStorage.getItem("auth-v2")
          ? JSON.parse(localStorage.getItem("auth-v2") || "{}").state?.user?._id
          : null;

        const message: Message = {
          ...data.message,
          isMine: data.message.sender._id === currentUserId,
        };

        get().addMessage(data.conversationId, message);
      },
    );

    socket.on("typing:update", (data: TypingStatus) => {
      if (data.isTyping) {
        get().setTyping(data);
      } else {
        get().clearTyping(data.conversationId);
      }
    });

    socket.on(
      "message:read",
      (data: { conversationId: string; userId: string }) => {
        get().markAsRead(data.conversationId);
      },
    );

    socket.on("message:reaction", (data: any) => {
      const { conversationId, messageId, reactions } = data;

      // Update message with full reactions list
      const state = get();
      const conversationMessages = state.messages[conversationId] || [];

      const updatedMessages = conversationMessages.map((msg) =>
        msg._id === messageId ? { ...msg, reactions: reactions || [] } : msg,
      );

      get().setMessages(conversationId, updatedMessages);
    });

    socket.on(
      "message:deleted",
      (data: { conversationId: string; messageId: string }) => {
        get().deleteMessage(data.conversationId, data.messageId);
      },
    );

    socket.on("user:online", (data: { userId: string }) => {
      get().setUserOnline(data.userId);
    });

    socket.on("user:offline", (data: { userId: string }) => {
      get().setUserOffline(data.userId);
    });

    socket.on("conversation:unmatched", (data: any) => {
      console.log("Unmatched:", data);
      // Handle unmatch
    });

    socket.on("user:blocked", (data: any) => {
      console.log("Blocked:", data);
      // Handle block
    });
  },

  disconnectSocket: () => {
    socketManager.disconnect();
    set({ isConnected: false });
  },

  joinConversation: (conversationId) => {
    socketManager.emit("conversation:join", { conversationId });
  },

  sendMessage: (data) => {
    socketManager.emit("message:send", data);
  },

  startTyping: (conversationId) => {
    socketManager.emit("typing:start", { conversationId });
  },

  stopTyping: (conversationId) => {
    socketManager.emit("typing:stop", { conversationId });
  },

  reactToMessage: (messageId, emoji) => {
    socketManager.emit("message:react", { messageId, emoji });
  },

  deleteMessageSocket: (messageId) => {
    socketManager.emit("message:delete", { messageId });
  },

  unmatchUser: (conversationId) => {
    socketManager.emit("conversation:unmatch", { conversationId });
  },

  blockUser: (conversationId, userId) => {
    socketManager.emit("user:block", { conversationId, userId });
  },
}));
