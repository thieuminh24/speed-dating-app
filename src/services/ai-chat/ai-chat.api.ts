// services/ai-chat/ai-chat.api.ts
import userService from "../config";

export interface SendMessageRequest {
  message: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  totalMessages: number;
  lastMessageAt?: string;
}

export interface SendMessageResponse {
  message: string;
  timestamp: string;
}

/**
 * Gửi tin nhắn đến AI advisor
 */
export const sendMessage = async (
  message: string,
): Promise<SendMessageResponse> => {
  const { data } = await userService.post<SendMessageResponse>(
    "/ai-chat/send",
    { message },
  );
  return data;
};

/**
 * Lấy lịch sử chat
 */
export const getChatHistory = async (): Promise<ChatHistoryResponse> => {
  const { data } =
    await userService.get<ChatHistoryResponse>("/ai-chat/history");
  return data;
};

/**
 * Xóa lịch sử chat
 */
export const clearChatHistory = async (): Promise<{ message: string }> => {
  const { data } = await userService.delete<{ message: string }>(
    "/ai-chat/history",
  );
  return data;
};
