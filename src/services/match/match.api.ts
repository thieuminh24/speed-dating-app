// services/match/match.api.ts (Updated)
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
export const getRecommendationPartner = async () => {
  const { data } = await userService.get(`/matching/recommendations`);
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
