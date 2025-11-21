"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PaymentGateway, ProductType } from "@/services/payment/payment.types";
import { usePayment } from "@/store/payment.store";
import { createPayment } from "@/services/payment/payment.api";
import { PricingCard } from "./components/PricingCard";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";

export default function PaymentPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { products, fetchProducts, isLoading } = usePayment();

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentGateway | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSelect = (productType: ProductType) => {
    setSelectedProduct(productType);
    
    setError(null);
  };

  const handlePayment = async () => {
    if (!selectedProduct || !selectedMethod) {
      setError("Vui lòng chọn gói và phương thức thanh toán");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await createPayment({
        productType: selectedProduct,
        gateway: selectedMethod,
        returnUrl: `${window.location.origin}/payment/vnpay-return`,
      });

      if (selectedMethod === PaymentGateway.VNPAY && response.paymentUrl) {
        // Redirect to VNPay
        window.location.href = response.paymentUrl;
      } else if (
        selectedMethod === PaymentGateway.STRIPE &&
        response.clientSecret
      ) {
        // Redirect to Stripe checkout
        router.push(
          `/payment/stripe-checkout?clientSecret=${response.clientSecret}&transactionId=${response.transactionId}`,
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Separate products by type
  const subscriptions = products.filter(
    (p) => p.id.includes("premium") || p.id.includes("vip"),
  );
  const oneTimeProducts = products.filter(
    (p) => p.id.includes("super_like") || p.id.includes("boost"),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Nâng cấp tài khoản</h1>
            <p className="text-gray-600">Chọn gói phù hợp với bạn</p>
          </div>
        </div>

        {/* Subscriptions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Gói đăng ký</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptions.map((product, index) => (
              <PricingCard
                key={product.id}
                product={product}
                onSelect={handleProductSelect}
                isPopular={index === 1} // Premium Monthly
              />
            ))}
          </div>
        </section>

        {/* One-time products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Mua lẻ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {oneTimeProducts.map((product) => (
              <PricingCard
                key={product.id}
                product={product}
                onSelect={handleProductSelect}
              />
            ))}
          </div>
        </section>

        {/* Payment Method Selection */}
        {selectedProduct && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onSelect={setSelectedMethod}
              />

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={!selectedMethod || processing}
                className="w-full mt-6 py-4 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-pink-500 to-purple-500
                  hover:from-pink-600 hover:to-purple-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  "Thanh toán ngay"
                )}
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
