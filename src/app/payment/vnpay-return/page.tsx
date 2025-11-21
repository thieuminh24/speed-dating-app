"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/store/auth.store";

export default function VNPayReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchSubscription } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const vnpResponseCode = searchParams?.get("vnp_ResponseCode");
    const vnpTxnRef = searchParams?.get("vnp_TxnRef");

    if (vnpResponseCode === "00") {
      setStatus("success");
      setMessage("Thanh toán thành công!");

      // Refresh user subscription status
      setTimeout(() => {
        router.push("/app");
      }, 3000);
    } else {
      setStatus("failed");
      setMessage("Thanh toán thất bại hoặc bị hủy");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Đang xử lý...</h2>
              <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
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
                  hover:from-pink-600 hover:to-purple-600"
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
                    hover:from-pink-600 hover:to-purple-600"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => router.push("/app")}
                  className="w-full py-3 rounded-lg font-semibold text-gray-700
                    border border-gray-300 hover:bg-gray-50"
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
