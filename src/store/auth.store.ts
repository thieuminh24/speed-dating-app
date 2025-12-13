// store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserAuthData = {
  _id: string;
  name: string;
  email: string;
  photos: string[];
  avatar?: string;
  isPremium?: boolean;
  subscriptionTier?: "Free" | "Premium" | "VIP";
  premiumUntil?: string;
  role?: "user" | "admin";
  authProvider?: "local" | "google";
  isNewUser?: boolean;
};

type AuthState = {
  token: string | null;
  user: UserAuthData | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (token: string, user: UserAuthData) => void;
  logout: () => void;
  hydrate: () => void;
  updateUser: (user: Partial<UserAuthData>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (token, user) => {
        const avatar = user.photos[0] || "";
        set({
          token,
          user: { ...user, avatar },
          isAuthenticated: true,
          isHydrated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isHydrated: true,
        });
      },

      hydrate: () => set({ isHydrated: true }),

      // ĐÃ SỬA: Tự động cập nhật avatar khi photos thay đổi
      updateUser: (userData) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.user, ...userData };

          // Nếu có thay đổi photos → cập nhật avatar luôn
          if (userData.photos !== undefined) {
            updatedUser.avatar = userData.photos[0] || "";
          }

          return { user: updatedUser };
        }),
    }),
    {
      name: "auth-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.token ? true : false,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    },
  ),
);
