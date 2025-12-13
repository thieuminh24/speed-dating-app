// services/auth/auth.api.ts
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

// ✅ THÊM MỚI: Google Auth Request
export interface GoogleAuthRequest {
  idToken: string;
}

// ✅ THÊM MỚI: Auth Response
export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  photos: string[];
  role?: string;
  isPremium: boolean;
  subscriptionTier: "Free" | "Premium" | "VIP";
  premiumUntil?: string;
  authProvider: "local" | "google";
  isNewUser?: boolean;
  token: string;
  googleData?: {
    googleId: string;
    email: string;
    name: string;
    photo: string;
  };
}

export const register = async (
  user: RegisterRequest,
): Promise<AuthResponse> => {
  const { data } = await userService.post("/auth/register", user);
  return data;
};

export const login = async (user: LoginRequest): Promise<AuthResponse> => {
  const { data } = await userService.post("/auth/login", user);
  return data;
};

export const logout = async () => {
  const { data } = await userService.post("/auth/logout");
  return data;
};

// ✅ THÊM MỚI: Google OAuth Login
export const googleAuth = async (
  request: GoogleAuthRequest,
): Promise<AuthResponse> => {
  const { data } = await userService.post("/auth/google", request);
  return data;
};
