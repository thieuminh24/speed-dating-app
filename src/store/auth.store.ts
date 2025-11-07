// src/store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  _id: string;
  name: string;
  email: string;
  photos: string[];
  avatar?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // ← RÕ RÀNG HƠN isReady

  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void; // ← Gọi 1 lần duy nhất
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
    }),
    {
      name: "auth-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.token ? true : false,
      }),
      // TỰ ĐỘNG GỌI hydrate() SAU KHI ĐỌC XONG
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    },
  ),
);
