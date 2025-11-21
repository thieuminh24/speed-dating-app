"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStripe, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Tải Stripe một lần (ngoài component)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// Component con dùng useStripe()
function StripeReturnContent() {
  const router = useRouter();
  const stripe = useStripe();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      setStatus("failed");
      setMessage("Không tìm thấy thông tin thanh toán");
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setStatus("success");
            setMessage("Thanh toán thành công!");
            setTimeout(() => router.push("/app"), 3000);
            break;

          case "processing":
            setStatus("loading");
            setMessage("Đang xử lý thanh toán...");
            break;

          case "requires_payment_method":
            setStatus("failed");
            setMessage("Thanh toán thất bại. Vui lòng thử lại.");
            break;

          default:
            setStatus("failed");
            setMessage("Có lỗi xảy ra. Vui lòng liên hệ hỗ trợ.");
            break;
        }
      })
      .catch(() => {
        setStatus("failed");
        setMessage("Lỗi kết nối. Vui lòng thử lại.");
      });
  }, [stripe, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Đang xử lý...</h2>
              <p className="text-gray-600">
                {message || "Vui lòng chờ trong giây lát"}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-green-600">
                {message}
              </h2>
              <p className="text-gray-600 mb-6">
                Tài khoản của bạn đã được nâng cấp thành công
              </p>
              <button
                onClick={() => router.push("/app")}
                className="w-full py-3 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-pink-500 to-purple-500
                  hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                Về trang chủ
              </button>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-red-600">
                {message}
              </h2>
              <p className="text-gray-600 mb-6">
                Vui lòng thử lại hoặc liên hệ hỗ trợ
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/payment")}
                  className="w-full py-3 rounded-lg font-semibold text-white
                    bg-gradient-to-r from-pink-500 to-purple-500
                    hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => router.push("/app")}
                  className="w-full py-3 rounded-lg font-semibold text-gray-700
                    border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Về trang chủ
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Page chính – bọc trong <Elements>
export default function StripeReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      }
    >
      <Elements stripe={stripePromise}>
        <StripeReturnContent />
      </Elements>
    </Suspense>
  );
}
