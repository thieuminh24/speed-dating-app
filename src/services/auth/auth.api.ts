//services/auth/auth.api.ts
import userService from "../config";

export interface Location {
  lat: number;
  lon: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  photos: string[];
  location?: Location;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (user: RegisterRequest) => {
  const { data } = await userService.post("/auth/register", user);
  return data;
};

export const login = async (user: LoginRequest) => {
  const { data } = await userService.post("/auth/login", user);
  return data;
};
