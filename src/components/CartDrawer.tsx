"use client";

import React from "react";
import { X, Trash2, ShoppingBag, MoveRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-in cart panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-primary/10 flex flex-col justify-between z-50 animate-slide-left select-none">
        {/* Top Header */}
        <div className="p-5 border-b border-primary/10 flex items-center justify-between bg-cream/40">
          <div className="flex items-center gap-2 text-charcoal">
            <ShoppingBag size={20} className="text-primary" />
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              Your Shopping Bag
              <span className="text-xs bg-primary text-white font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-cream border border-transparent hover:border-primary/20 rounded-full text-charcoal hover:text-primary transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Cart Items List */}
        <div className="flex-grow overflow-y-auto p-5 space-y-5 bg-white select-none">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-primary/5 pb-4 last:border-b-0 animate-fade-in select-none items-center"
              >
                <div className="w-20 h-20 bg-cream/40 rounded-xl border border-primary/10 p-2 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="flex-grow flex flex-col justify-between h-full select-none">
                  <div>
                    <h4 className="text-sm font-black text-charcoal tracking-tight leading-tight line-clamp-1 mb-0.5">
                      {item.name}
                    </h4>
                    {item.variant && (
                      <span className="text-[10px] bg-primary/10 text-primary border border-primary/15 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                        {item.variant}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 select-none">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-primary/10 rounded-xl bg-white p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-charcoal hover:text-primary font-bold cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-black text-charcoal select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs text-charcoal hover:text-primary font-bold cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-charcoal">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] text-primary hover:text-primary/70 font-extrabold flex items-center gap-1 mt-1 cursor-pointer select-none uppercase tracking-wide"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 select-none animate-fade-in">
              <p className="text-sm font-black text-charcoal">Your bag is empty.</p>
              <p className="text-xs text-charcoal/60 mt-1 max-w-xs font-normal">
                Let's explore our premium home appliances and add items to your cart.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-primary text-white text-xs md:text-sm font-black px-6 py-3 rounded-xl cursor-pointer hover:bg-primary/95 transition-all shadow-sm select-none"
              >
                Browse Collections
              </button>
            </div>
          )}
        </div>

        {/* Checkout Bottom Area */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-primary/15 bg-cream/30 flex flex-col gap-4 select-none">
            <div className="flex items-center justify-between text-base">
              <span className="text-sm font-extrabold text-charcoal/60 uppercase tracking-widest">
                Cart Subtotal
              </span>
              <span className="text-xl font-black text-charcoal">
                ₹{subtotal}
              </span>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-[11px] text-primary font-bold text-center select-none">
              Free Pan-India Delivery and Installation Applied
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 select-none shadow-md"
            >
              Secure Checkout <MoveRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
