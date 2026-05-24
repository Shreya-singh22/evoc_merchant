
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle, RefreshCcw, Headset, ArrowLeft } from "lucide-react";

export default function FailureClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const reason = searchParams.get("reason");

  const errorMessages: Record<string, string> = {
    "hash_mismatch": "Security verification failed. Please try again.",
    "amount_mismatch": "There was a discrepancy in the order amount.",
    "session_not_found": "The checkout session could not be located.",
    "failure": "The payment was declined by your bank or the gateway.",
    "internal_error": "An unexpected server error occurred."
  };

  const displayMessage = errorMessages[reason || ""] || "We couldn't process your payment at this time.";

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Header />
      <main className="flex-grow flex flex-col items-center py-20 px-4">
        
        <div className="bg-white p-10 md:p-14 rounded-3xl border border-red-100 shadow-xl max-w-xl w-full text-center flex flex-col items-center animate-fade-in">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
            <AlertCircle size={40} />
          </div>
          
          <h1 className="text-3xl font-black text-charcoal mb-4">Payment Failed</h1>
          <p className="text-charcoal/60 text-base mb-8 max-w-xs">
            {displayMessage}
          </p>

          <div className="flex flex-col gap-4 w-full">
            {sessionId && (
              <Link
                href={`/checkout?sessionId=${sessionId}`}
                className="bg-primary hover:bg-primary/95 text-white font-black text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} /> Retry Checkout
              </Link>
            )}
            <Link
              href="/"
              className="bg-white border border-primary/10 hover:border-primary/40 text-charcoal font-black text-sm py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Return to Store
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-primary/5 w-full flex items-center justify-center gap-2 text-charcoal/40 text-[10px] font-bold uppercase tracking-widest">
            <Headset size={14} /> Need help? Contact Support
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
