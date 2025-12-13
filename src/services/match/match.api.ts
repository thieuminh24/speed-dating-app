// services/match/match.api.ts
import userService from "../config";

export const getAllUsers = async () => {
  const { data } = await userService.get("/users");
  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await userService.get(`/users/${id}`);
  return data;
};

export const createUser = async (user: {
  name: string;
  age: number;
  avatar?: string;
}) => {
  const { data } = await userService.post("/users", user);
  return data;
};

// ===== MATCHING ENDPOINTS =====

// Get recommendations
export const getRecommendationPartner = async (filters?: {
  minAge?: number;
  maxAge?: number;
  gender?: "Male" | "Female" | "Non-binary" | "Other";
}) => {
  const params = new URLSearchParams();

  if (filters?.minAge) params.append("minAge", filters.minAge.toString());
  if (filters?.maxAge) params.append("maxAge", filters.maxAge.toString());
  if (filters?.gender) params.append("gender", filters.gender);

  const { data } = await userService.get(
    `/matching/recommendations${params.toString() ? `?${params.toString()}` : ""}`,
  );
  return data;
};

// Like a user
export const likeUser = async (targetUserId: string) => {
  const { data } = await userService.post(`/matching/like`, { targetUserId });
  return data;
};

// Pass a user
export const passUser = async (targetUserId: string) => {
  const { data } = await userService.post(`/matching/pass`, { targetUserId });
  return data;
};

// Get all matches
export const getMatches = async () => {
  const { data } = await userService.get(`/matching/matches`);
  return data;
};

// ===== PREMIUM FEATURE =====

// Get likes received (Premium only)
export const getLikesReceived = async () => {
  const { data } = await userService.get(`/matching/likes-received`);
  return data;
};

// Legacy function - deprecated
export const swipeUser = async (
  currentUserId: string,
  targetUserId: string,
  like: boolean,
) => {
  if (like) {
    return likeUser(targetUserId);
  } else {
    return passUser(targetUserId);
  }
};
