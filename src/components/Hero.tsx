"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';

const SLIDES = [
  {
    id: 1,
    title: "Beat the Heat with Smart Cooling",
    subtitle: "Summer Collection",
    description: "Stay perfectly chilled. Explore our energy-saving coolers and high-speed fans.",
    tag: "UP TO 50% OFF",
    bg: "bg-gradient-to-tr from-[#f6ede2] via-[#F8F1E7] to-[#ffe5cf]",
    cta: "Explore Coolers",
    link: "#coolers",
  },
  {
    id: 2,
    title: "Grind Smarter, Cook Faster",
    subtitle: "Indian Kitchen Essentials",
    description: "Precision-engineered heavy duty mixer grinders built to last generations.",
    tag: "BEST SELLER",
    bg: "bg-gradient-to-tr from-[#f3e7df] via-[#F8F1E7] to-[#fad6ce]",
    cta: "Shop Mixers",
    link: "#mixer-grinders",
  },
  {
    id: 3,
    title: "The Ultimate Festival Collection",
    subtitle: "Make Every Meal Grand",
    description: "Multi-functional kitchen appliances to simplify large family gatherings.",
    tag: "FESTIVE SALE",
    bg: "bg-gradient-to-tr from-[#faebe1] via-[#F8F1E7] to-[#ffe8d4]",
    cta: "View Collection",
    link: "#discover",
  },
  {
    id: 4,
    title: "The Next-Gen Smart Irons",
    subtitle: "New Arrivals",
    description: "Remove creases effortlessly with smart steam control and Teflon soleplates.",
    tag: "PRE-ORDER NOW",
    bg: "bg-gradient-to-tr from-[#ebe8e2] via-[#F8F1E7] to-[#dfecfb]",
    cta: "Discover Irons",
    link: "#irons",
  },
];

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden select-none bg-cream flex">
      {/* Primary Hero Banner Image */}
      <img
        src={`${BASE_PATH}/moonstruck-banner.jpg`}
        alt="Elevate Your Home with Celestial Craftsmanship"
        className="w-full h-auto object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
      {/* Fallback Message if image is missing */}
      <div className="hidden w-full h-[400px] flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <h2 className="text-2xl font-black text-primary mb-2">Banner Image Missing</h2>
        <p className="text-charcoal/70">Please save your banner image as <strong>moonstruck-banner.png</strong> inside the <code>public/</code> folder.</p>
      </div>
      <a href="#discover" className="absolute inset-0 z-10" aria-label="Shop Moonstruck Collection" />
    </div>
  );
}
