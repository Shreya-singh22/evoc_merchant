
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PartyPopper, CheckCircle2, Package, Truck, ArrowRight, Loader2 } from "lucide-react";
import { checkoutApi } from "@/lib/checkout-api";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      checkoutApi.getSummary(sessionId)
        .then(res => setSession(res.data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Header />
      <main className="flex-grow flex flex-col items-center py-16 px-4">
        
        {/* Success Hero */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-primary/10 shadow-xl max-w-2xl w-full text-center flex flex-col items-center animate-fade-in">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 relative">
            <PartyPopper size={48} />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
              <CheckCircle2 size={24} className="text-green-500" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-charcoal mb-4">Order Confirmed!</h1>
          <p className="text-charcoal/60 text-base md:text-lg mb-8 max-w-md">
            Thank you for choosing Moonstruck. Your premium home appliance is being prepared for dispatch.
          </p>

          {session && (
            <div className="w-full bg-cream/30 border border-primary/5 rounded-2xl p-6 mb-8 flex flex-col gap-4 text-left">
              <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-charcoal/40">Order Number</span>
                <span className="text-sm font-bold text-charcoal">{session.id.split("-")[0].toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-charcoal/40">Amount Paid</span>
                <span className="text-lg font-black text-charcoal">₹{session.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          )}

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

        {/* Next Steps */}
        <div className="max-w-2xl w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
              <Package size={24} />
            </div>
            <h4 className="text-sm font-black text-charcoal uppercase tracking-wider">Processing</h4>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase leading-relaxed">We are verifying your order details.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
              <Truck size={24} />
            </div>
            <h4 className="text-sm font-black text-charcoal uppercase tracking-wider">Shipping</h4>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase leading-relaxed">Dispatched within 24 hours.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-sm font-black text-charcoal uppercase tracking-wider">Delivery</h4>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase leading-relaxed">Arriving at your doorstep soon.</p>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
