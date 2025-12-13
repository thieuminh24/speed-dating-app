// src/types/anonymous-chat.types.ts

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

export interface MatchingStatus {
  isSearching: boolean;
  queuePosition?: number;
}

export interface RoomInfo {
  roomId: string;
  yourAnonymousName: string;
  partnerAnonymousName: string;
  status: string;
  messageCount: number;
  createdAt: string;
}

export interface MessagesResponse {
  messages: AnonymousMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  roomInfo: {
    status: string;
    yourAnonymousName: string;
    partnerAnonymousName: string;
    messageCount: number;
  };
}

// Socket Events
export type SocketEvent =
  | "connect"
  | "disconnect"
  | "match:found"
  | "message:new"
  | "typing:update"
  | "partner:disconnected"
  | "partner:reconnected"
  | "partner:left"
  | "room:rejoined";

// Disconnect Reasons
export enum DisconnectReason {
  USER_LEFT = "user_left",
  PARTNER_LEFT = "partner_left",
  IDLE_TIMEOUT = "idle_timeout",
  CONNECTION_LOST = "connection_lost",
  SYSTEM_CLOSED = "system_closed",
}
