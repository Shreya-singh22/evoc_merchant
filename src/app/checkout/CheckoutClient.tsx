"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Lock, MoveRight, ShieldCheck, CreditCard, Gift, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function CheckoutClient() {
  const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';
  const getMediaUrl = (src: string) => src.startsWith('http') ? src : `${BASE_PATH}${src}`;

  const { cartItems, setCartItems } = useCart() as any;
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    // In a real app, clear cart here
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="bg-white p-10 rounded-2xl border border-primary/10 shadow-xl max-w-md w-full text-center flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <PartyPopper size={40} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Order Confirmed!</h1>
            <p className="text-charcoal/70 mb-8">
              Thank you for choosing Moonstruck. Your premium home appliance is being prepared for dispatch.
            </p>
            <Link 
              href="/"
              className="bg-primary hover:bg-primary/95 text-white font-black text-sm px-8 py-4 rounded-xl shadow-md transition-all inline-block uppercase tracking-wider"
            >
              Return to Store
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Header />
      
      <main className="flex-grow py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h1 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-charcoal/70 mb-8">Please add items to your cart before proceeding to checkout.</p>
            <Link href="/" className="bg-primary hover:bg-primary/95 text-white font-black text-sm px-8 py-4 rounded-xl shadow-md transition-all inline-block">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                Shipping Details
              </h2>
              <form onSubmit={handlePlaceOrder} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm">
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-charcoal/60 border-b border-primary/10 pb-2">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold">Email Address *</label>
                      <input required type="email" placeholder="you@example.com" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold">Phone Number *</label>
                      <input required type="tel" placeholder="+91 98765 43210" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-charcoal/60 border-b border-primary/10 pb-2">
                    Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold">First Name *</label>
                      <input required type="text" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold">Last Name *</label>
                      <input required type="text" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold">Street Address *</label>
                    <input required type="text" placeholder="House number and street name" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold">City *</label>
                      <input required type="text" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold">State *</label>
                      <input required type="text" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold">PIN Code *</label>
                      <input required type="text" className="px-4 py-3 bg-cream/50 border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-charcoal/60 border-b border-primary/10 pb-2">
                    Payment Method
                  </h3>
                  <div className="border border-primary/20 rounded-xl p-4 flex flex-col gap-3 bg-cream/30">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="radio" name="payment" className="w-4 h-4 accent-primary" defaultChecked />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold flex items-center gap-2">
                          <CreditCard size={16} /> Pay Online (UPI / Card / NetBanking)
                        </span>
                        <span className="text-xs text-charcoal/60 mt-0.5">Secure payment via Razorpay.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Lock size={16} /> Complete Order & Pay ₹{total}
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-28 bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm">
                <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto p-2 -mx-2">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-cream/50 rounded-xl border border-primary/10 p-2 flex-shrink-0 flex items-center justify-center relative">
                        <span className="absolute -top-2.5 -right-2.5 bg-charcoal text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm z-10">
                          {item.quantity}
                        </span>
                        <img src={getMediaUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-charcoal line-clamp-1">{item.name}</h4>
                        <span className="text-xs text-charcoal/60">{item.variant || "Standard"}</span>
                      </div>
                      <div className="text-sm font-black text-charcoal">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-primary/10 py-4 space-y-3">
                  <div className="flex justify-between text-sm text-charcoal/80">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-charcoal/80">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold tracking-wide uppercase text-xs">Free</span>
                  </div>
                </div>

                <div className="border-t border-primary/10 pt-4 mb-6 flex justify-between items-center">
                  <span className="text-lg font-black uppercase tracking-wider text-charcoal/80">Total</span>
                  <span className="text-2xl font-black text-charcoal">₹{total}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">
                    <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">
                      <strong>100% Safe & Secure.</strong> Your payment information is encrypted and securely processed.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-primary/5 text-primary p-3 rounded-xl border border-primary/10">
                    <Gift size={20} className="text-primary flex-shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">
                      You will earn <strong>{total / 10} Moonstruck Coins</strong> on this purchase!
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
