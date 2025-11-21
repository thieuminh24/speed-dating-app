// store/payment.store.ts
import {
  getProducts,
  getSubscription,
  getTransactions,
} from "@/services/payment/payment.api";
import {
  Product,
  Subscription,
  Transaction,
} from "@/services/payment/payment.types";
import { create } from "zustand";

interface PaymentState {
  products: Product[];
  transactions: Transaction[];
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  clearError: () => void;
}

export const usePayment = create<PaymentState>((set) => ({
  products: [],
  transactions: [],
  subscription: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getProducts();
      set({ products: data.products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getTransactions();
      set({ transactions: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getSubscription();
      set({ subscription: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
