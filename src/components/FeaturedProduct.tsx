"use client";

import React from "react";
import { Star, ShieldCheck, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ASSETS } from "@/config/assets";
import Link from "next/link";

export default function FeaturedProduct() {
  const { addToCart } = useCart();

  return (
    <section id="featured" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Left Side: Half image & Story */}
        <div className="lg:col-span-6 relative w-full h-[400px] md:h-[550px] animate-fade-in group select-none">
          <Link href="/products/ultra-grind-750w" className="absolute inset-0 bg-cream rounded-3xl border border-primary/10 overflow-hidden flex items-center justify-center p-8 shadow-sm hover:shadow-xl transition-all duration-700 block">
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <span className="bg-primary/95 text-white text-[10px] font-black px-2.5 py-1 uppercase rounded-full tracking-wider shadow-sm">
                Limited Time Offer
              </span>
              <span className="bg-gold text-charcoal text-[9px] font-black px-2 py-1 uppercase rounded-full tracking-wider shadow-sm">
                Save ₹1,500
              </span>
            </div>
            <img
              src={ASSETS.featuredProduct.mainImage}
              alt="Air cooler"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Right Side: Copy, info, CTA */}
        <div className="lg:col-span-6 flex flex-col items-start gap-4 animate-fade-in select-none">
          <span className="text-primary text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Spotlight Collection
          </span>
          <Link href="/products/ultra-grind-750w">
            <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15] hover:text-primary transition-colors">
              AeroCool Pro Elite Air Cooler
            </h2>
          </Link>

          <div className="flex items-center gap-6 border-b border-gray-100 pb-4 mb-2 select-none">
            <div className="flex flex-col">
              <span className="text-xs text-charcoal/50 font-bold uppercase tracking-wider">
                Overall Score
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xl font-black text-charcoal">4.9</span>
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-primary/10" />
            <div className="flex flex-col">
              <span className="text-xs text-charcoal/50 font-bold uppercase tracking-wider">
                User Satisfaction
              </span>
              <span className="text-lg font-black text-charcoal mt-0.5">
                98% Happy Customers
              </span>
            </div>
          </div>

          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-xl">
            Meet the top-of-the-line evaporative cooler designed explicitly for Indian summer routines. The AeroCool Pro Elite boasts high efficiency 100% copper motors, massive air delivery, honeycomb cooling pads, and an inverter compatibility feature to assure unbroken high-performance cooling.
          </p>

          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-xl">
            Backed by over 12+ years of in-house appliance manufacturing experience, each AeroCool undergoes intensive quality testing to stand test of time.
          </p>

          {/* Special pricing card */}
          <div className="bg-cream/50 p-4 md:p-5 rounded-2xl border border-primary/10 w-full max-w-md select-none mt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-primary/70 font-extrabold uppercase tracking-widest">
                  Bundle Deal Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-charcoal">
                    ₹8,499
                  </span>
                  <span className="text-sm text-charcoal/40 line-through">
                    ₹11,999
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-green-700 font-extrabold bg-green-100/60 px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-wide">
                Save ₹3,500
              </span>
            </div>

            <button
              onClick={() =>
                addToCart({
                  id: "prod_spotlight_aerocool",
                  name: "AeroCool Pro Elite Air Cooler",
                  price: 8499,
                  image: ASSETS.featuredProduct.cartImage,
                  quantity: 1,
                  variant: "Platinum Pro",
                })
              }
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <ShoppingCart size={18} /> Buy Now — Limited Time Deal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
