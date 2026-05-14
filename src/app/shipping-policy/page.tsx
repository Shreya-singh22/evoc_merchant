"use client";

import React from "react";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Truck, Calendar, MapPin, ShieldCheck, AlertCircle, ChevronRight, Info } from "lucide-react";


export default function ShippingPolicy() {
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
          <a href={`/`} className="hover:text-primary transition-colors">Home</a>
          <ChevronRight size={10} />
          <span className="text-charcoal font-bold">Shipping Policy</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4 mb-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary shadow-sm">
            <Truck size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-charcoal tracking-tight">
            Shipping Policy
          </h1>
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal/40 uppercase tracking-widest">
            <Calendar size={14} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto bg-white border border-primary/10 shadow-lg rounded-3xl p-6 md:p-14 text-charcoal/80 text-sm md:text-base leading-relaxed animate-slide-up space-y-10 font-medium">
          
          {/* Top Highlight */}
          <div className="bg-cream/20 border-l-4 border-primary p-6 rounded-r-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="font-bold text-charcoal text-lg">
                Free Shipping All Over India!
              </p>
              <p className="mt-1 text-sm text-charcoal/70">
                We use only reputable courier partners like Shiprocket to deliver safe & fast.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-primary/10 shadow-sm font-extrabold text-xs text-primary uppercase tracking-wider flex-shrink-0">
              <ShieldCheck size={16} />
              100% Insured Transit
            </div>
          </div>

          {/* Section: Order Processing & Addresses */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2 border-b border-gray-50 pb-2">
              <MapPin className="text-primary" size={20} /> Order Shipping & Address
            </h2>
            <p>
              Each order can be shipped only to a **single address**, which is specified at the time of payment for that order. If you wish to ship products to different addresses, you will need to place multiple orders.
            </p>
            <p>
              While moonstruck attempts to ship all items in a single order together, this may not always be possible due to product characteristics or availability.
            </p>
          </section>

          {/* Section: Timelines */}
          <section className="space-y-6 pt-6">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2 border-b border-gray-50 pb-2">
              <Calendar className="text-primary" size={20} /> Dispatch & Delivery Timelines
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-cream/5 border border-primary/5 p-5 rounded-2xl">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">Processing Window</span>
                <p className="text-charcoal font-bold leading-relaxed">
                  We make our best effort to ensure items are shipped within **3 working days**. In festival seasons or sales, it might take up to 5+ days.
                </p>
                <span className="text-xs text-charcoal/50 mt-2 block italic">Orders are processed Monday to Sunday.</span>
              </div>
              <div className="bg-cream/5 border border-primary/5 p-5 rounded-2xl">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">Transit Period</span>
                <p className="text-charcoal font-bold leading-relaxed">
                  Please allow **7 to 10 business days** for your order to arrive securely at your destination after dispatch.
                </p>
                <span className="text-xs text-charcoal/50 mt-2 block italic">National logistics partner: Shiprocket</span>
              </div>
            </div>
          </section>

          {/* Section: Invoicing & Tracking */}
          <section className="space-y-4 pt-6">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2 border-b border-gray-50 pb-2">
              <Info className="text-primary" size={20} /> Tracking & Invoicing
            </h2>
            <p>
              All orders are shipped with an invoice from moonstruck. In case you don't receive an invoice, you may submit a ticket by filling out this simple form at: <a href="https://www.moonstruck.co.in/raise-complaint" className="text-primary font-bold underline">Raise Complaint Link</a>.
            </p>
            <p>
              A shipping confirmation with your **tracking ID** will be sent to you after dispatch. You can use this ID to track your order live by visiting: <a href="https://www.moonstruck.co.in/pages/track-your-order" className="text-primary font-bold underline">Track Your Order Portal</a> to check approximate delivery time and current shipping status.
            </p>
          </section>

          {/* Section: Payment */}
          <section className="space-y-4 pt-6">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2 border-b border-gray-50 pb-2">
              <ShieldCheck className="text-primary" size={20} /> Payment Verification
            </h2>
            <p>
              Available payment methods include **Cash on Delivery (COD)** and prepaid options. Moonstruck does not provide COD services for all pin codes. You can easily check availability during the checkout process on our official website.
            </p>
          </section>

          {/* Critical Damaged / Tampered Policy Callout */}
          <section className="space-y-4 bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-serif font-black text-primary flex items-center gap-2">
              <AlertCircle size={22} /> Damage & Tampering Policy
            </h2>
            <div className="space-y-4 text-charcoal/90 text-sm font-medium leading-relaxed">
              <p>
                <strong>Visibly Damaged Products:</strong> If your order arrives visibly damaged, please contact customer service immediately. Reach out to us at <a href="https://www.moonstruck.co.in/pages/raise-complaint" className="text-primary underline font-bold">raise-complaint</a> with your Order ID and unboxing images. We will dispatch a replacement or initiate a refund immediately.
              </p>
              <p>
                <strong>Tampered Packaging:</strong> If you believe the outer packaging has been tampered with or damaged before delivery, **please refuse to take delivery of the package** and submit a support ticket immediately mentioning your Order ID. We will process an immediate replacement or refund.
              </p>
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
