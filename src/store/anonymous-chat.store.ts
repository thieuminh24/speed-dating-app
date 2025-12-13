// src/store/anonymous-chat.store.ts
import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { toast } from "@/hook/useToast";

export interface AnonymousMessage {
  _id: string;
  roomId: string;
  senderAnonymousName: string;
  content: string;
  type: "text" | "system";
  isMine: boolean;
  createdAt: string;
}

export interface AnonymousRoom {
  roomId: string;
  yourAnonymousName: string;
  partnerAnonymousName: string;
  status: "active" | "closed" | "timeout";
  messageCount: number;
  createdAt: string;
}

interface MatchingStatus {
  isSearching: boolean;
  queuePosition?: number;
}

interface AnonymousChatStore {
  // Socket connection
  socket: Socket | null;
  isConnected: boolean;

  // Matching state
  matchingStatus: MatchingStatus;

  // Current room
  currentRoom: AnonymousRoom | null;
  messages: AnonymousMessage[];

  // Partner status
  isPartnerTyping: boolean;
  isPartnerDisconnected: boolean;

  // Actions
  initializeSocket: (token: string, userId: string) => void;
  disconnectSocket: () => void;

  // Matching actions
  startMatching: () => void;
  cancelMatching: () => void;

  // Room actions
  sendMessage: (content: string) => void;
  leaveRoom: () => void;
  startTyping: () => void;
  stopTyping: () => void;

  // Internal state updates
  setMatchingStatus: (status: MatchingStatus) => void;
  setCurrentRoom: (room: AnonymousRoom | null) => void;
  addMessage: (message: AnonymousMessage) => void;
  setMessages: (messages: AnonymousMessage[]) => void;
  clearMessages: () => void;
}

export const useAnonymousChatStore = create<AnonymousChatStore>((set, get) => ({
  socket: null,
  isConnected: false,
  matchingStatus: { isSearching: false },
  currentRoom: null,
  messages: [],
  isPartnerTyping: false,
  isPartnerDisconnected: false,

  // ===== INITIALIZE SOCKET =====
  initializeSocket: (token: string, userId: string) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      console.log("Anonymous chat socket already connected");
      return;
    }

    const socket = io("http://localhost:4000/anonymous-chat", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // ===== CONNECTION EVENTS =====
    socket.on("connect", () => {
      console.log("✅ Anonymous chat socket connected");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("❌ Anonymous chat socket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (error) => {
      console.error("Anonymous chat connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to anonymous chat",
        variant: "destructive",
      });
    });

    // ===== MATCH FOUND =====
    socket.on("match:found", (data) => {
      console.log("🎉 Match found:", data);

      set({
        matchingStatus: { isSearching: false },
        currentRoom: {
          roomId: data.roomId,
          yourAnonymousName: data.yourAnonymousName,
          partnerAnonymousName: data.partnerAnonymousName,
          status: "active",
          messageCount: 0,
          createdAt: new Date().toISOString(),
        },
        messages: [],
      });

      // Auto join room
      socket.emit("room:join", { roomId: data.roomId });

      toast({
        title: "Match Found! 🎉",
        description: `You're now chatting as ${data.yourAnonymousName}`,
      });
    });

    // ===== ROOM REJOINED (after reconnect) =====
    socket.on("room:rejoined", (roomData) => {
      console.log("🔄 Room rejoined:", roomData);
      set({ currentRoom: roomData });
    });

    // ===== NEW MESSAGE =====
    socket.on("message:new", (data) => {
      console.log("📨 New message:", data);

      const { yourAnonymousName } = get().currentRoom || {};
      const isMine = data.senderAnonymousName === yourAnonymousName;

      get().addMessage({
        _id: data.messageId,
        roomId: data.roomId,
        senderAnonymousName: data.senderAnonymousName,
        content: data.content,
        type: "text",
        isMine,
        createdAt: data.createdAt,
      });

      // Show notification if not mine
      if (!isMine) {
        toast({
          title: data.senderAnonymousName,
          description: data.content,
        });
      }
    });

    // ===== TYPING INDICATOR =====
    socket.on("typing:update", (data) => {
      set({ isPartnerTyping: data.isTyping });
    });

    // ===== PARTNER DISCONNECTED =====
    socket.on("partner:disconnected", (data) => {
      console.log("⚠️ Partner disconnected");
      set({ isPartnerDisconnected: true });

      toast({
        title: "Partner Disconnected",
        description: data.message || "Waiting for reconnection...",
        variant: "destructive",
      });
    });

    // ===== PARTNER RECONNECTED =====
    socket.on("partner:reconnected", (data) => {
      console.log("✅ Partner reconnected");
      set({ isPartnerDisconnected: false });

      toast({
        title: "Partner Reconnected",
        description: data.message || "Partner is back!",
      });
    });

    // ===== PARTNER LEFT =====
    socket.on("partner:left", (data) => {
      console.log("👋 Partner left");

      toast({
        title: "Chat Ended",
        description: data.message || "The other user has left the chat.",
        variant: "destructive",
      });

      // Clear room after 2 seconds
      setTimeout(() => {
        set({
          currentRoom: null,
          messages: [],
          isPartnerTyping: false,
          isPartnerDisconnected: false,
        });
      }, 2000);
    });

    set({ socket });
  },

  // ===== DISCONNECT SOCKET =====
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        matchingStatus: { isSearching: false },
        currentRoom: null,
        messages: [],
      });
    }
  },

  // ===== START MATCHING =====
  startMatching: () => {
    const { socket, currentRoom } = get();

    console.log("🎯 Starting matching...");
    console.log("Socket connected?", socket?.connected);
    console.log("Current room?", currentRoom);

    if (currentRoom) {
      toast({
        title: "Already in Chat",
        description: "Please leave current chat first",
        variant: "destructive",
      });
      return;
    }

    if (!socket?.connected) {
      console.error("❌ Socket not connected!");
      toast({
        title: "Not Connected",
        description: "Please wait for connection...",
        variant: "destructive",
      });
      return;
    }

    console.log("📤 Emitting matching:start");
    socket.emit("matching:start");
    set({ matchingStatus: { isSearching: true } });

    toast({
      title: "Searching...",
      description: "Looking for someone to chat with",
    });
  },

  // ===== CANCEL MATCHING =====
  cancelMatching: () => {
    const { socket } = get();
    socket?.emit("matching:cancel");
    set({ matchingStatus: { isSearching: false } });

    toast({
      title: "Search Cancelled",
      description: "You stopped searching for a chat partner",
    });
  },

  // ===== SEND MESSAGE =====
  sendMessage: (content: string) => {
    const { socket, currentRoom } = get();

    if (!currentRoom) {
      toast({
        title: "No Active Chat",
        description: "Start matching to chat with someone",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) return;

    socket?.emit("message:send", {
      roomId: currentRoom.roomId,
      content: content.trim(),
    });
  },

  // ===== LEAVE ROOM =====
  leaveRoom: () => {
    const { socket, currentRoom } = get();

    if (!currentRoom) return;

    socket?.emit("room:leave", { roomId: currentRoom.roomId });

    set({
      currentRoom: null,
      messages: [],
      isPartnerTyping: false,
      isPartnerDisconnected: false,
    });

    toast({
      title: "Left Chat",
      description: "You can start a new chat anytime",
    });
  },

  // ===== TYPING INDICATORS =====
  startTyping: () => {
    const { socket, currentRoom } = get();
    if (currentRoom) {
      socket?.emit("typing:start", { roomId: currentRoom.roomId });
    }
  },

  stopTyping: () => {
    const { socket, currentRoom } = get();
    if (currentRoom) {
      socket?.emit("typing:stop", { roomId: currentRoom.roomId });
    }
  },

  // ===== STATE UPDATES =====
  setMatchingStatus: (status) => set({ matchingStatus: status }),

  setCurrentRoom: (room) => set({ currentRoom: room }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [] }),
}));
