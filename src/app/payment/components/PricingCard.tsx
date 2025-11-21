"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Product, ProductType } from "@/services/payment/payment.types";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

interface PricingCardProps {
  product: Product;
  onSelect: (productType: ProductType) => void;
  isPopular?: boolean;
}

export function PricingCard({
  product,
  onSelect,
  isPopular,
}: PricingCardProps) {
  const getIcon = () => {
    if (product.id.includes("vip")) return <Crown className="w-6 h-6" />;
    if (product.id.includes("premium")) return <Sparkles className="w-6 h-6" />;
    if (product.id.includes("boost")) return <Zap className="w-6 h-6" />;
    return <Check className="w-6 h-6" />;
  };

  const formatPrice = () => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(product.price);
  };

  return (
    <Card
      className={`relative cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
        isPopular ? "border-2 border-pink-500" : ""
      }`}
      onClick={() => onSelect(product.id)}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Phổ biến nhất
        </div>
      )}

      <CardContent className="p-6">
        {/* Icon & Name */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-pink-100 to-purple-100">
            {getIcon()}
          </div>
          {product.duration && (
            <span className="text-sm text-gray-500">
              {product.duration} ngày
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold mb-2">{product.nameVi}</h3>

        {/* Price */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-pink-500">
            {formatPrice()}
          </div>
          {product.duration && (
            <p className="text-sm text-gray-500">
              {Math.round(product.price / product.duration).toLocaleString(
                "vi-VN",
              )}
              đ/ngày
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className="w-full mt-6 py-3 rounded-lg font-semibold transition-all
            bg-gradient-to-r from-pink-500 to-purple-500 text-white
            hover:from-pink-600 hover:to-purple-600"
        >
          Chọn gói
        </button>
      </CardContent>
    </Card>
  );
}
