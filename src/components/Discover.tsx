"use client";

import React, { useState } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ASSETS } from "@/config/assets";

const TABS = ["Best Sellers", "Value Combos", "New Arrivals"];

const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    tab: "Best Sellers",
    name: "Ultra-Grind 750W Mixer Grinder",
    description: "Multi-purpose mixer grinder for high efficiency and uniform wet/dry grinding.",
    price: 3499,
    mrp: 4999,
    savings: 1500,
    rating: 4.8,
    reviews: 142,
    variants: ["750W", "1000W"],
    badge: "Best Seller",
    coins: 100,
    image1: ASSETS.discover[0].image1,
    image2: ASSETS.discover[0].image2,
  },
  {
    id: "prod_2",
    tab: "Best Sellers",
    name: "AeroCool Pro Air Cooler",
    description: "Massive air flow capacity with smart inverter compatibility for summer comfort.",
    price: 8499,
    mrp: 12499,
    savings: 4000,
    rating: 4.9,
    reviews: 310,
    variants: ["25L", "40L", "60L"],
    badge: "Most Popular",
    coins: 250,
    image1: ASSETS.discover[1].image1,
    image2: ASSETS.discover[1].image2,
  },
  {
    id: "prod_3",
    tab: "Value Combos",
    name: "Ultimate Morning Combo",
    description: "Mixer Grinder + Smart Toaster bundle to jumpstart your mornings with ease.",
    price: 4999,
    mrp: 7999,
    savings: 3000,
    rating: 4.7,
    reviews: 89,
    variants: ["Standard", "Premium"],
    badge: "Mega Deal",
    coins: 150,
    image1: ASSETS.discover[2].image1,
    image2: ASSETS.discover[2].image2,
  },
  {
    id: "prod_4",
    tab: "Value Combos",
    name: "Smart Laundry Starter Pack",
    description: "Dry Iron + Handheld Garment Steamer for wrinkle-free crisp perfection.",
    price: 2499,
    mrp: 3999,
    savings: 1500,
    rating: 4.9,
    reviews: 55,
    variants: ["Duo Kit"],
    badge: "Value Pack",
    coins: 75,
    image1: ASSETS.discover[3].image1,
    image2: ASSETS.discover[3].image2,
  },
  {
    id: "prod_5",
    tab: "New Arrivals",
    name: "AeroBreeze Ceiling Fan",
    description: "High performance BLDC fan with smart remote control and noise reduction.",
    price: 3299,
    mrp: 4999,
    savings: 1700,
    rating: 5.0,
    reviews: 12,
    variants: ["Brown", "White", "Ivory"],
    badge: "New Launch",
    coins: 100,
    image1: ASSETS.discover[4].image1,
    image2: ASSETS.discover[4].image2,
  },
  {
    id: "prod_6",
    tab: "New Arrivals",
    name: "ThermaSafe Winter Heater",
    description: "Room heater with instant heating technology, tip-over protection, and 3 settings.",
    price: 2799,
    mrp: 4299,
    savings: 1500,
    rating: 4.8,
    reviews: 24,
    variants: ["1000W", "2000W"],
    badge: "Winter Spl",
    coins: 80,
    image1: ASSETS.discover[5].image1,
    image2: ASSETS.discover[5].image2,
  },
];

export default function Discover() {
  const [activeTab, setActiveTab] = useState("Best Sellers");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const handleSelectVariant = (prodId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [prodId]: variant }));
  };

  const activeProducts = INITIAL_PRODUCTS.filter((p) => p.tab === activeTab);

  return (
    <section id="discover" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none bg-cream/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl animate-fade-in flex flex-col gap-2">
          <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Premium Selection
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
            Discover Excellence
          </h2>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
            Engineered for optimum performance, reliability, and modern efficiency. High-end builds made for daily use.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-xl border border-primary/10 shadow-sm w-full md:w-auto overflow-x-auto self-start md:self-end">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none text-xs md:text-sm font-black tracking-wide px-5 md:px-7 py-3 rounded-lg transition-all cursor-pointer text-center ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md scale-[1.02]"
                  : "bg-transparent text-charcoal/70 hover:text-primary hover:bg-cream/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tabbed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 animate-fade-in">
        {activeProducts.map((p) => {
          const currentVariant = selectedVariants[p.id] || p.variants[0];
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col group relative"
            >
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <span className="bg-primary/95 text-white text-[10px] font-black px-2.5 py-1 uppercase rounded-full shadow-md tracking-wider">
                  {p.badge}
                </span>
                <span className="bg-gold text-charcoal text-[9px] font-black px-2 py-1 uppercase rounded-full shadow-md tracking-wider flex items-center gap-1">
                  Save ₹{p.savings}
                </span>
              </div>

              {/* Hover-swap product image */}
              <div className="relative w-full h-64 md:h-72 bg-cream/10 overflow-hidden flex items-center justify-center p-6 cursor-pointer">
                <img
                  src={p.image1}
                  alt={p.name}
                  className="w-full h-full object-contain transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                  loading="lazy"
                />
                <img
                  src={p.image2}
                  alt={p.name}
                  className="w-full h-full object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute inset-0 p-6 m-auto"
                  loading="lazy"
                />
              </div>

              {/* Product Info & CTA */}
              <div className="p-5 md:p-6 flex flex-col flex-grow bg-white border-t border-gray-50 relative select-none">
                <div className="flex items-center gap-1 text-gold mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(p.rating) ? "fill-gold text-gold" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-xs text-charcoal/60 font-semibold ml-1">
                    ({p.reviews})
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-black text-charcoal leading-tight mb-1 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>

                <p className="text-xs md:text-sm text-charcoal/60 font-normal leading-relaxed mb-4 flex-grow">
                  {p.description}
                </p>

                {/* Variant Selector */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] font-extrabold text-charcoal/40 uppercase tracking-widest">
                    Model Variant:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => handleSelectVariant(p.id, v)}
                        className={`text-[10px] font-bold px-2.5 py-1 border rounded-lg transition-all cursor-pointer ${
                          currentVariant === v
                            ? "bg-charcoal text-white border-charcoal scale-105"
                            : "bg-white text-charcoal/70 border-gray-200 hover:border-primary/40"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing & Savings Callout */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3.5 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-primary/70 font-extrabold uppercase tracking-wider">
                      Special Deal Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-charcoal">
                        ₹{p.price}
                      </span>
                      <span className="text-xs text-charcoal/40 line-through">
                        ₹{p.mrp}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] text-green-700 font-extrabold bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                      <ShieldCheck size={11} className="inline text-green-700" /> Save ₹{p.savings}
                    </span>
                    <span className="text-[9px] text-primary font-bold mt-1 tracking-wider uppercase">
                      Earn +{p.coins} Coins
                    </span>
                  </div>
                </div>

                {/* Loyalty coins indicator */}
                <div className="mb-4 bg-primary/5 p-2 rounded-xl text-[10px] text-primary font-bold text-center border border-primary/10 select-none">
                  Use "Moonstruck Coins" to redeem up to 10% on future orders!
                </div>

                {/* Quick Add to Cart button */}
                <button
                  onClick={() =>
                    addToCart({
                      id: `${p.id}_${currentVariant}`,
                      name: p.name,
                      price: p.price,
                      originalPrice: p.mrp,
                      image: p.image1,
                      quantity: 1,
                      variant: currentVariant,
                    })
                  }
                  className="w-full text-center bg-primary hover:bg-primary/95 text-white font-black text-xs md:text-sm py-3.5 rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0"
                >
                  Quick Add To Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 md:mt-16 text-center select-none">
        <a
          href="#discover"
          className="inline-block bg-transparent text-charcoal border border-charcoal/30 hover:border-primary hover:text-primary font-bold text-sm px-10 py-3.5 rounded-xl transition-all cursor-pointer hover:shadow-sm"
        >
          Browse All Premium Collections
        </a>
      </div>
    </section>
  );
}
