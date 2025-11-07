// services/userService/users.t

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

// Swipe
export const getSwipeUsers = async (currentUserId: string) => {
  const { data } = await userService.get(`/users/${currentUserId}/swipe/list`);
  return data;
};

export const swipeUser = async (
  currentUserId: string,
  targetUserId: string,
  like: boolean,
) => {
  const { data } = await userService.post(
    `/users/${currentUserId}/swipe/${targetUserId}`,
    { like },
  );
  return data;
};

// Matches
export const getMatches = async (currentUserId: string) => {
  const { data } = await userService.get(`/users/${currentUserId}/matches`);
  return data;
};
