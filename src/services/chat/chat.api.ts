// src/services/chat/chat.api.ts
import userService from "../config";

// Get all conversations
export const getConversations = async () => {
  const { data } = await userService.get("/chat/conversations");
  return data;
};

// Get single conversation
export const getConversation = async (conversationId: string) => {
  const { data } = await userService.get(
    `/chat/conversations/${conversationId}`,
  );
  return data;
};

// Create conversation from match
export const createConversationFromMatch = async (matchId: string) => {
  const { data } = await userService.post(
    `/chat/conversations/from-match/${matchId}`,
  );
  return data;
};

// Get messages
export const getMessages = async (
  conversationId: string,
  page: number = 1,
  limit: number = 50,
) => {
  const { data } = await userService.get(
    `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
  );
  return data;
};

// Send message (REST fallback)
export const sendMessage = async (messageData: {
  conversationId: string;
  type: "text" | "image" | "file";
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}) => {
  const { data } = await userService.post("/chat/messages", messageData);
  return data;
};

// Upload file
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await userService.post("/chat/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Mark as read
export const markAsRead = async (conversationId: string) => {
  const { data } = await userService.post(
    `/chat/conversations/${conversationId}/read`,
  );
  return data;
};

// React to message
export const reactToMessage = async (messageId: string, emoji: string) => {
  const { data } = await userService.post(`/chat/messages/${messageId}/react`, {
    emoji,
  });
  return data;
};

// Delete message
export const deleteMessage = async (messageId: string) => {
  const { data } = await userService.delete(`/chat/messages/${messageId}`);
  return data;
};

// Unmatch
export const unmatchUser = async (conversationId: string) => {
  const { data } = await userService.post(
    `/chat/conversations/${conversationId}/unmatch`,
  );
  return data;
};

// Block user
export const blockUser = async (conversationId: string) => {
  const { data } = await userService.post(
    `/chat/conversations/${conversationId}/block`,
  );
  return data;
};

// Unblock user
export const unblockUser = async (conversationId: string) => {
  const { data } = await userService.post(
    `/chat/conversations/${conversationId}/unblock`,
  );
  return data;
};
