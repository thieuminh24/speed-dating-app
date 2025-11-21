// services/payment/payment.types.ts

export enum PaymentGateway {
  STRIPE = "stripe",
  VNPAY = "vnpay",
}

export enum ProductType {
  PREMIUM_MONTHLY = "premium_monthly",
  PREMIUM_YEARLY = "premium_yearly",
  VIP_MONTHLY = "vip_monthly",
  VIP_YEARLY = "vip_yearly",
  SUPER_LIKE = "super_like",
  BOOST = "boost",
}

export enum SubscriptionTier {
  FREE = "Free",
  PREMIUM = "Premium",
  VIP = "VIP",
}

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface Product {
  id: ProductType;
  name: string;
  nameVi: string;
  price: number;
  priceUSD: number;
  duration?: number;
  features: string[];
}

export interface CreatePaymentRequest {
  productType: ProductType;
  gateway: PaymentGateway;
  returnUrl?: string;
}

export interface PaymentResponse {
  paymentUrl?: string;
  clientSecret?: string;
  transactionId: string;
  amount: number;
  currency: string;
}

export interface Transaction {
  _id: string;
  transactionId: string;
  gateway: PaymentGateway;
  productType: ProductType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
  paidAt?: string;
}

export interface Subscription {
  _id: string;
  tier: SubscriptionTier;
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}
