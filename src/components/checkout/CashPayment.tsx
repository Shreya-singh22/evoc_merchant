"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { createCodOrder } from "@/actions";

interface ShippingAddress {
  id: string;
  type: string;
  flatHouse: string;
  areaStreet: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string | null;
  isDefault: boolean;
}

interface CashPaymentProps {
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
  userId: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: any[];
  totalAmount: number;
  codFee?: number;
  shippingAddress?: ShippingAddress | null;
}

export default function CashPayment({
  onSuccess,
  onCancel,
  userId,
  customerFirstName,
  customerLastName,
  customerEmail,
  customerPhone,
  items,
  totalAmount,
  codFee = 0,
  shippingAddress,
}: CashPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createCodOrder({
        userId,
        items,
        totalAmount: totalAmount + codFee,
        firstName: customerFirstName,
        lastName: customerLastName,
        email: customerEmail,
        customerPhone,
        shippingAddress: shippingAddress
          ? {
              flatHouse: shippingAddress.flatHouse,
              areaStreet: shippingAddress.areaStreet,
              city: shippingAddress.city,
              state: shippingAddress.state,
              pincode: shippingAddress.pincode,
            }
          : undefined,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to create order");
      }

      setIsProcessing(false);
      onSuccess(result.orderId!);
    } catch (err: any) {
      setError(err.message || "Failed to process order. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💵</span>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-charcoal">
              Cash on Delivery
            </h4>
            <p className="text-xs text-charcoal/60 mt-1 leading-relaxed text-pretty">
              Pay with cash when your order arrives.
              {codFee > 0 && (
                <span className="text-amber-600 font-bold">
                  {" "}
                  A fee of Rs. {codFee} applies.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
        <p className="text-xs text-charcoal/70 leading-relaxed">
          By confirming your order, you agree to pay the total amount in cash
          upon delivery. Our delivery partner will collect the payment at your
          doorstep.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={handleConfirmOrder}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary/95 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            `Confirm Order - ₹${(totalAmount + codFee).toLocaleString()}`
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full bg-white border border-primary/10 text-charcoal font-bold text-sm py-3 rounded-xl cursor-pointer hover:bg-cream transition-all disabled:opacity-50"
        >
          Choose Different Payment
        </button>
      </div>
    </div>
  );
}