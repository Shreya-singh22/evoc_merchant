"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { ASSETS } from "@/config/assets";

const REVIEWS_DATA = [
  {
    id: 1,
    name: "Meera Agarwal",
    rating: 5,
    date: "May 1, 2026",
    text: "Absolutely wowed by the motor power of the mixer grinder! Grinding heavy idli batter is a smooth breeze now.",
    product: "Mixer Grinder",
    image: ASSETS.reviews[0],
  },
  {
    id: 2,
    name: "Vikram Malhotra",
    rating: 5,
    date: "April 29, 2026",
    text: "The air cooler cools our whole living room in less than 15 minutes. Very quiet and aesthetically pleasing.",
    product: "Air Cooler",
    image: ASSETS.reviews[1],
  },
  {
    id: 3,
    name: "Anjali Menon",
    rating: 5,
    date: "April 22, 2026",
    text: "The premium cream texture blends with our modern kitchen flawlessly. Highly recommend the starter combo.",
    product: "Kitchen Appliance",
    image: ASSETS.reviews[2],
  },
];

export default function Reviews() {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % REVIEWS_DATA.length);
  };

  return (
    <section id="reviews" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 bg-cream/30 border-y border-primary/5 select-none overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
        <div className="max-w-xl flex flex-col gap-2">
          <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Verified Impressions
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
            Hear from Our Customers
          </h2>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
            See why millions of Indian homes love our heavy-duty, long-lasting premium appliances.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-end">
          <button
            onClick={handlePrev}
            className="p-3 bg-white hover:bg-cream border border-charcoal/10 hover:border-primary/30 rounded-full text-charcoal hover:text-primary cursor-pointer shadow-sm hover:scale-110 active:scale-95 transition-all"
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-white hover:bg-cream border border-charcoal/10 hover:border-primary/30 rounded-full text-charcoal hover:text-primary cursor-pointer shadow-sm hover:scale-110 active:scale-95 transition-all"
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
        {REVIEWS_DATA.map((r, idx) => (
          <div
            key={r.id}
            className={`flex flex-col bg-white border border-primary/10 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex-1 relative ${
              idx === current ? "border-primary/30 scale-[1.02] bg-white z-10" : "opacity-85"
            }`}
          >
            <div className="flex items-center justify-between mb-4 select-none">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/20 flex-shrink-0">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-charcoal">{r.name}</h4>
                  <p className="text-[10px] text-primary/70 font-bold uppercase tracking-wider">
                    Verified Purchase
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                {r.date}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-3 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < r.rating ? "fill-gold text-gold" : "text-gray-300"}
                />
              ))}
            </div>

            <p className="text-xs md:text-sm text-charcoal/70 italic font-normal leading-relaxed mb-5 flex-grow select-none">
              "{r.text}"
            </p>

            <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-charcoal/50 uppercase tracking-wide">
                Purchased: {r.product}
              </span>
              <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1 font-bold">
                <ShieldCheck size={12} className="inline" /> Reviewed On Loox
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
