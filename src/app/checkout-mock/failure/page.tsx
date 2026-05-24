"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle, RefreshCcw, ArrowLeft } from "lucide-react";

export default function CheckoutMockFailurePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="bg-white p-10 md:p-14 rounded-3xl border border-red-100 shadow-xl max-w-xl w-full text-center flex flex-col items-center animate-fade-in">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
            <AlertCircle size={40} />
          </div>

          <h1 className="text-3xl font-serif font-black text-charcoal mb-4 text-balance">
            Payment Failed
          </h1>
          <p className="text-charcoal/60 text-base mb-8 max-w-xs text-pretty leading-relaxed">
            We couldn't process your payment at this time. Please try again.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <Link
              href="/"
              className="bg-primary hover:bg-primary/95 text-white font-black text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={16} /> Try Again
            </Link>
            <Link
              href="/"
              className="bg-white border border-primary/10 hover:border-primary/40 text-charcoal font-black text-sm py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Return to Store
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}