"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PaymentGateway } from "@/services/payment/payment.types";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentGateway | null;
  onSelect: (method: PaymentGateway) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: PaymentGateway.STRIPE,
      name: "Thẻ quốc tế",
      description: "Visa, Mastercard, American Express",
      icon: <CreditCard className="w-8 h-8" />,
    },
    {
      id: PaymentGateway.VNPAY,
      name: "VNPay",
      description: "Thẻ ATM, Ví điện tử VN",
      icon: <Wallet className="w-8 h-8" />,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chọn phương thức thanh toán</h3>

      <div className="grid grid-cols-2 gap-4">
        {methods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedMethod === method.id
                ? "border-2 border-pink-500 shadow-lg"
                : "border"
            }`}
            onClick={() => onSelect(method.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3 text-pink-500">
                {method.icon}
              </div>
              <h4 className="font-semibold mb-1">{method.name}</h4>
              <p className="text-sm text-gray-500">{method.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
