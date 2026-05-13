"use client";

import React from "react";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RotateCcw, Calendar, CreditCard, ShieldAlert, CheckCircle2, XCircle, Phone, ChevronRight } from "lucide-react";

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';

export default function RefundPolicy() {
  const lastUpdated = "May 13, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-cream/30 text-charcoal font-sans select-none">
      <div className="sticky top-0 z-50 w-full">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow pt-8 pb-20 px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="max-w-4xl mx-auto flex items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal/50 mb-8 animate-fade-in">
          <a href={`${BASE_PATH}/`} className="hover:text-primary transition-colors">Home</a>
          <ChevronRight size={10} />
          <span className="text-charcoal font-bold">Refund & Returns Policy</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4 mb-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary shadow-sm">
            <RotateCcw size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-charcoal tracking-tight">
            Refund & Return
          </h1>
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal/40 uppercase tracking-widest">
            <Calendar size={14} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto bg-white border border-primary/10 shadow-lg rounded-3xl p-6 md:p-14 text-charcoal/80 text-sm md:text-base leading-relaxed animate-slide-up space-y-12 font-medium">
          
          {/* SECTION 1: RETURN POLICY */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
              <RotateCcw className="text-primary" size={24} />
              <h2 className="text-2xl font-serif font-black text-charcoal">Return Policy</h2>
            </div>
            <p>
              If you receive a damaged, defective, or incorrect product, a **free replacement** will be provided if the product qualifies under the warranty terms and conditions.
            </p>
            
            <div className="bg-cream/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center border border-primary/5">
              <p className="text-sm font-bold text-charcoal">
                To initiate the return, please contact our support team before using the product.
              </p>
              <a href="tel:+918448609059" className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-primary/15 text-charcoal font-black text-sm hover:text-primary transition-all shadow-sm flex-shrink-0">
                <Phone size={16} className="text-primary" />
                +91 84486 09059
              </a>
            </div>

            <h3 className="text-lg font-black text-charcoal mt-6 mb-3">Conditions for Return</h3>
            <ul className="space-y-3 pl-2">
              <li className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Notify us within **48 hours** of receiving a damaged or incorrect product.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>The product must be **unused** and returned in its original packaging, along with all original price tags, labels, and the invoice.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Ensure the return package is **securely packed** to avoid any further damage during transit.</span>
              </li>
            </ul>
          </section>

          {/* SECTION 2: REFUND TIMELINES */}
          <section className="space-y-6 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
              <CreditCard className="text-primary" size={24} />
              <h2 className="text-2xl font-serif font-black text-charcoal">Refund Process</h2>
            </div>
            <p>
              Once we receive the returned product, we will inspect and initiate the refund process. Refunds are issued back to the original payment method used during checkout:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="p-6 border border-primary/10 rounded-2xl bg-cream/5">
                <h4 className="font-black text-charcoal mb-2">Credit & Debit Cards</h4>
                <p className="text-sm text-charcoal/75 leading-relaxed">
                  Refunds will be credited back to the card within **7 working days**. The amount will reflect in your next billing statement.
                </p>
              </div>
              <div className="p-6 border border-primary/10 rounded-2xl bg-cream/5">
                <h4 className="font-black text-charcoal mb-2">Net Banking / UPI</h4>
                <p className="text-sm text-charcoal/75 leading-relaxed">
                  Refunds will be processed directly into the bank account used for the original transaction.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: WARRANTY POLICY */}
          <section className="space-y-6 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
              <ShieldAlert className="text-primary" size={24} />
              <h2 className="text-2xl font-serif font-black text-charcoal">Warranty Policy</h2>
            </div>
            <p>
              Our warranty policy applies to products purchased within the territory of **India** and is extended only to the **first end-user customer**. Please retain your original purchase invoice as it is mandatory to claim service.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              {/* Covered */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-extrabold tracking-widest uppercase text-green-700 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Covered Under Warranty
                </span>
                <ul className="space-y-2 text-sm pl-1 text-charcoal/80">
                  <li className="flex gap-2">
                    <span>•</span> <span>Valid only in India for the first buyer.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> <span>Functional parts and software issues arising from manufacturing defects.</span>
                  </li>
                </ul>
              </div>

              {/* Not Covered */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-extrabold tracking-widest uppercase text-primary flex items-center gap-2">
                  <XCircle size={16} /> Not Covered Under Warranty
                </span>
                <ul className="space-y-2 text-sm pl-1 text-charcoal/80">
                  <li className="flex gap-2">
                    <span>•</span> <span>Damages caused by improper installation or mishandling.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> <span>External accessories such as batteries, cables, and bags.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> <span>Plastic, rubber, glass, aesthetic parts or consumables.</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> <span>Transit handling/transportation charges for service center repairs.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Void Conditions */}
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 md:p-8 mt-6">
              <h4 className="font-serif font-black text-red-800 text-base md:text-lg mb-2 flex items-center gap-2">
                Warranty Null & Void Cases
              </h4>
              <p className="text-sm text-red-900/75 font-medium mb-3">
                The standard manufacturer warranty shall stand void in the following scenarios:
              </p>
              <ul className="list-disc list-inside text-sm text-red-900/80 space-y-1 pl-2 font-bold">
                <li>Altered, defaced, or removed serial numbers.</li>
                <li>Failure to operate the product according to instructions provided in the official User Guide.</li>
              </ul>
            </div>
          </section>

        </div>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
