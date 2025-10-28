// services/api/users.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", // URL backend NestJS
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (user: {
  name: string;
  age: number;
  avatar?: string;
}) => {
  const { data } = await api.post("/users", user);
  return data;
};

// Swipe
export const getSwipeUsers = async (currentUserId: string) => {
  const { data } = await api.get(`/users/${currentUserId}/swipe/list`);
  return data;
};

export const swipeUser = async (
  currentUserId: string,
  targetUserId: string,
  like: boolean,
) => {
  const { data } = await api.post(
    `/users/${currentUserId}/swipe/${targetUserId}`,
    { like },
  );
  return data;
};

// Matches
export const getMatches = async (currentUserId: string) => {
  const { data } = await api.get(`/users/${currentUserId}/matches`);
  return data;
};
