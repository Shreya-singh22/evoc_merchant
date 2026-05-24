"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PartyPopper, CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";

export default function CheckoutMockSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Header />
      <main className="flex-grow flex flex-col items-center py-16 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-primary/10 shadow-xl max-w-2xl w-full text-center flex flex-col items-center animate-fade-in">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 relative">
            <PartyPopper size={48} />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
              <CheckCircle2 size={24} className="text-green-500" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-black text-charcoal mb-4 text-balance">
            Order Confirmed!
          </h1>
          <p className="text-charcoal/60 text-base md:text-lg mb-8 max-w-md text-pretty leading-relaxed">
            Thank you for your order. Your premium home appliance is being prepared for dispatch.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Link
              href="/"
              className="bg-primary hover:bg-primary/95 text-white font-black text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
            <Link
              href="/track-order"
              className="bg-white border border-primary/10 hover:border-primary/40 text-charcoal font-black text-sm py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Truck size={16} /> Track Order
            </Link>
          </div>
        </div>

        <div className="max-w-2xl w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
              <Package size={24} />
            </div>
            <h4 className="text-sm font-black text-charcoal uppercase tracking-wider">Processing</h4>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase leading-relaxed">
              We are verifying your order details.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
              <Truck size={24} />
            </div>
            <h4 className="text-sm font-black text-charcoal uppercase tracking-wider">Shipping</h4>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase leading-relaxed">
              Dispatched within 24 hours.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-sm font-black text-charcoal uppercase tracking-wider">Delivery</h4>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase leading-relaxed">
              Arriving at your doorstep soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}