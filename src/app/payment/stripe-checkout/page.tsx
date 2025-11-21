"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { StripeCheckoutForm } from "./components/StripeCheckoutForm";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

function StripeCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    const secret = searchParams?.get("clientSecret");
    const txnId = searchParams?.get("transactionId");

    if (!secret || !txnId) {
      router.push("/payment");
      return;
    }

    setClientSecret(secret);
    setTransactionId(txnId);
  }, [searchParams, router]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#ec4899",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Thanh toán bằng thẻ
          </h2>

          <Elements stripe={stripePromise} options={options}>
            <StripeCheckoutForm transactionId={transactionId} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StripeCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      }
    >
      <StripeCheckoutContent />
    </Suspense>
  );
}
