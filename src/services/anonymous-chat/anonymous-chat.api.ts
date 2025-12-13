// src/services/anonymous-chat/anonymous-chat.api.ts
import userService from "../config";

// Get current active room
export const getCurrentRoom = async () => {
  const { data } = await userService.get("/anonymous-chat/current-room");
  return data;
};

// Get messages for a room
export const getAnonymousMessages = async (
  roomId: string,
  page: number = 1,
  limit: number = 50,
) => {
  const { data } = await userService.get(
    `/anonymous-chat/messages?roomId=${roomId}&page=${page}&limit=${limit}`,
  );
  return data;
};

// Leave room (REST fallback)
export const leaveAnonymousRoom = async (roomId: string) => {
  const { data } = await userService.delete(`/anonymous-chat/leave/${roomId}`);
  return data;
};

// Get queue statistics
export const getQueueStats = async () => {
  const { data } = await userService.get("/anonymous-chat/stats");
  return data;
};

// Health check
export const checkAnonymousChatHealth = async () => {
  const { data } = await userService.get("/anonymous-chat/health");
  return data;
};
