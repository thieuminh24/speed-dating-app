// services/payment/payment.api.ts
import userService from "../config";
import {
  CreatePaymentRequest,
  PaymentResponse,
  Product,
  Subscription,
  Transaction,
} from "./payment.types";

export const getProducts = async (): Promise<{ products: Product[] }> => {
  const { data } = await userService.get("/payment/products");
  return data;
};

export const createPayment = async (
  request: CreatePaymentRequest,
): Promise<PaymentResponse> => {
  const { data } = await userService.post("/payment/create", request);
  return data;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await userService.get("/payment/transactions");
  return data;
};

export const getSubscription = async (): Promise<Subscription | null> => {
  try {
    const { data } = await userService.get("/payment/subscription");
    return data;
  } catch (error) {
    return null;
  }
};
