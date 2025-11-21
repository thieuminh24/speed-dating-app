"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

interface StripeCheckoutFormProps {
  transactionId: string;
}

export function StripeCheckoutForm({ transactionId }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/stripe-return?transactionId=${transactionId}`,
        },
      });

      if (submitError) {
        setError(submitError.message || "Có lỗi xảy ra");
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-3 rounded-lg font-semibold text-white
          bg-gradient-to-r from-pink-500 to-purple-500
          hover:from-pink-600 hover:to-purple-600
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang xử lý...
          </span>
        ) : (
          "Thanh toán ngay"
        )}
      </button>

      <button
        type="button"
        onClick={() => router.back()}
        disabled={isProcessing}
        className="w-full py-3 rounded-lg font-semibold text-gray-700
          border border-gray-300 hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Quay lại
      </button>
    </form>
  );
}
