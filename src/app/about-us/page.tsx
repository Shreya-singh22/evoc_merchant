"use client";

import React from "react";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-cream/30 text-charcoal font-sans select-none pb-14 sm:pb-0">
      <div className="sticky top-0 z-50 w-full">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow overflow-hidden">
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Subtle elegant background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
            <div className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-primary blur-3xl" />
            <div className="absolute bottom-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-gold blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-8 md:gap-12 animate-fade-in">
              {/* Header block */}
              <div className="flex flex-col gap-3 border-b border-primary/10 pb-8 md:pb-12">
                <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Our Story
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-black text-charcoal tracking-tight leading-tight">
                  About Us
                </h1>
              </div>

              {/* Story Content Block - Beautiful lifestyle editorial typography */}
              <div className="space-y-8 text-charcoal/85 text-base md:text-xl leading-relaxed font-serif font-medium animate-fade-in">
                <p className="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                  At Moonstruck, we believe every Indian home deserves appliances that are powerful, stylish, and affordable — without paying extra just for a brand name. Built with a vision to bring premium-quality home and kitchen appliances directly to consumers, Moonstruck combines smart engineering, modern design, and reliable performance for everyday living.
                </p>
                <p>
                  From mixer grinders and kitchen essentials to cooling and home comfort appliances, every Moonstruck product is designed to simplify daily life while delivering long-lasting performance. With a strong focus on Indian manufacturing and value-driven innovation, we create products that fit perfectly into modern Indian homes.
                </p>
                <p>
                  What makes us different is simple — we remove unnecessary middlemen costs and focus on delivering better quality at honest prices. Our products are thoughtfully built for Indian households, tested for durability, and crafted to offer the perfect balance of performance, affordability, and style.
                </p>
                <p className="border-l-4 border-primary/25 pl-6 py-1 italic text-charcoal/90">
                  Today, Moonstruck is trusted by thousands of customers across India and continues to grow as a brand committed to making everyday living smarter, easier, and more comfortable. Because for us, home appliances are not just products — they are part of the way you live every day.
                </p>
              </div>

              {/* Minimal signature / signoff */}
              <div className="flex items-center gap-4 pt-6 border-t border-primary/10 mt-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-primary font-black text-sm">
                  MS
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-charcoal/50">Designed for Living</p>
                  <p className="text-sm font-black text-charcoal">The Moonstruck Team</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />

      {/* Inline Animation Styles for Framer-like behavior in Tailwind 4 */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
