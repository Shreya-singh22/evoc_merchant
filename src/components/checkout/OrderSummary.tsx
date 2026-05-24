"use client";

import React, { useMemo } from "react";
import { Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface OrderSummaryProps {
  paymentMethod: "COD" | "PAYU" | null;
  completedOrder?: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
      variant?: string;
    }>;
    totalAmount: number;
    codFee: number;
  } | null;
  codFee?: number;
}

export default function OrderSummary({
  paymentMethod,
  completedOrder,
  codFee = 40,
}: OrderSummaryProps) {
  const { cartItems } = useCart();

  const items = completedOrder?.items || cartItems;
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );
  const total = subtotal + (paymentMethod === "COD" ? codFee : 0);

  return (
    <div className="sticky top-28 bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm">
      <h2 className="text-xl font-sans font-bold mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-cream/50 rounded-xl border border-primary/10 p-2 flex-shrink-0 relative">
              <span className="absolute -top-2.5 -right-2.5 bg-charcoal text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm z-10">
                {item.quantity}
              </span>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-bold text-charcoal line-clamp-1">
                {item.name}
              </h4>
              {item.variant && (
                <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                  {item.variant}
                </span>
              )}
            </div>
            <div className="text-sm font-black text-charcoal tabular-nums">
              ₹{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-primary/10 py-4 space-y-3">
        <div className="flex justify-between text-sm text-charcoal/80">
          <span>Subtotal</span>
          <span className="font-bold tabular-nums">₹{subtotal.toLocaleString()}</span>
        </div>
        {paymentMethod === "COD" && (
          <div className="flex justify-between text-sm text-charcoal/80">
            <span>COD Fee</span>
            <span className="font-bold tabular-nums">₹{codFee}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-charcoal/80">
          <span>Shipping</span>
          <span className="text-green-600 font-bold tracking-wide uppercase text-xs">Free</span>
        </div>
      </div>

      <div className="border-t border-primary/10 pt-4 flex justify-between items-center">
        <span className="text-lg font-black uppercase tracking-wider text-charcoal/80">
          Total
        </span>
        <span className="text-2xl font-black text-charcoal tabular-nums">
          ₹{total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}