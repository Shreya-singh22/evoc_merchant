"use client";

import React, { useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-6 select-none bg-white">
      <div className="bg-cream/50 border border-primary/10 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 animate-fade-in select-none relative overflow-hidden">
        {/* Subtle pattern background for aesthetic depth */}
        <div className="absolute inset-0 bg-[radial-gradient(#C8102E_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.025]" />

        <div className="flex-1 flex flex-col items-start gap-3 relative z-10">
          <span className="bg-primary/10 text-primary border border-primary/15 text-[10px] md:text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-2">
            <Sparkles size={12} className="animate-pulse" /> Welcome offer
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
            Get ₹200 off your first order
          </h2>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-lg">
            Join the Moonstruck community for exclusive first-access updates, energy-saving advice, and early sale access.
          </p>
        </div>

        <div className="w-full md:w-auto md:min-w-[420px] relative z-10 flex flex-col gap-3 self-center">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow bg-white text-charcoal text-sm md:text-base px-5 py-4 rounded-xl border border-primary/15 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 shadow-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base px-8 py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md flex-shrink-0"
              >
                Claim Discount
              </button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-800 animate-fade-in shadow-sm select-none">
              <ShieldCheck size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-black tracking-tight leading-tight">Discount code sent!</p>
                <p className="text-xs text-green-700/80 mt-0.5">Check your email inbox for your ₹200 gift voucher.</p>
              </div>
            </div>
          )}
          <span className="text-[10px] text-charcoal/40 font-bold tracking-wide text-center sm:text-left">
            🔒 By signing up, you agree to receive promotional updates from us. Unsubscribe anytime.
          </span>
        </div>
      </div>
    </section>
  );
}
