// store/verification.store.ts
import { create } from "zustand";
import {
  getVerificationStatus,
  VerificationStatus,
  VerificationStatusResponse,
} from "@/services/verification/verification.api";

interface VerificationState {
  isPhotoVerified: boolean;
  verificationStatus: VerificationStatus;
  latestRequest: VerificationStatusResponse["latestRequest"] | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStatus: () => Promise<void>;
  updateStatus: (data: Partial<VerificationStatusResponse>) => void;
  reset: () => void;
}

export const useVerification = create<VerificationState>((set) => ({
  isPhotoVerified: false,
  verificationStatus: "none",
  latestRequest: null,
  isLoading: false,
  error: null,

  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getVerificationStatus();
      set({
        isPhotoVerified: data.isPhotoVerified,
        verificationStatus: data.verificationStatus,
        latestRequest: data.latestRequest,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Không thể tải trạng thái xác thực",
        isLoading: false,
      });
    }
  },

  updateStatus: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  reset: () =>
    set({
      isPhotoVerified: false,
      verificationStatus: "none",
      latestRequest: null,
      isLoading: false,
      error: null,
    }),
}));
