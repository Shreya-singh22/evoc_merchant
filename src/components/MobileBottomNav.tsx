"use client";

import React from "react";
import { Home, Compass, Play, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileBottomNav() {
  const { cartItems, setIsCartOpen } = useCart();

  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-primary/20 p-2.5 flex items-center justify-around z-50 shadow-2xl select-none backdrop-blur-md">
      <a
        href={`${BASE_PATH}/`}
        className="flex flex-col items-center gap-0.5 text-center text-charcoal hover:text-primary transition-colors cursor-pointer select-none"
      >
        <Home size={20} className="text-charcoal/80" />
        <span className="text-[10px] font-bold tracking-wide">Home</span>
      </a>

      <a
        href={`${BASE_PATH}/products`}
        className="flex flex-col items-center gap-0.5 text-center text-charcoal hover:text-primary transition-colors cursor-pointer select-none"
      >
        <Compass size={20} className="text-charcoal/80" />
        <span className="text-[10px] font-bold tracking-wide">Shop</span>
      </a>

      <a
        href="#reels"
        className="flex flex-col items-center gap-0.5 text-center text-charcoal hover:text-primary transition-colors cursor-pointer select-none relative"
      >
        <Play size={20} className="text-primary animate-pulse" />
        <span className="text-[10px] font-bold tracking-wide">Reels</span>
      </a>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-0.5 text-center text-charcoal hover:text-primary transition-colors cursor-pointer select-none relative"
      >
        <div className="relative">
          <ShoppingCart size={20} className="text-charcoal/80" />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center animate-bounce">
              {totalQty}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-wide">Cart</span>
      </button>

      <a
        href="#faq"
        className="flex flex-col items-center gap-0.5 text-center text-charcoal hover:text-primary transition-colors cursor-pointer select-none"
      >
        <User size={20} className="text-charcoal/80" />
        <span className="text-[10px] font-bold tracking-wide">Account</span>
      </a>
    </div>
  );
}
