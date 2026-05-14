"use client";

import React from "react";
import { Shield, Sparkles, Award, Globe, Heart } from "lucide-react";

const STATS = [
  {
    id: 1,
    icon: <Globe size={28} />,
    title: "1M+ Homes",
    sub: "Powered Pan-India",
  },
  {
    id: 2,
    icon: <Award size={28} />,
    title: "ISI Certified",
    sub: "Top safety standard",
  },
  {
    id: 3,
    icon: <Shield size={28} />,
    title: "2-Year Warranty",
    sub: "Comprehensive cover",
  },
  {
    id: 4,
    icon: <Sparkles size={28} />,
    title: "Eco-Efficient",
    sub: "BEE Star performance",
  },
  {
    id: 5,
    icon: <Heart size={28} />,
    title: "24/7 Support",
    sub: "Pan-India service",
  },
];

export default function StatsTrust() {
  return (
    <section id="stats" className="py-16 bg-cream/40 border-y border-primary/10 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-center gap-6 md:gap-4 items-stretch">
          {STATS.map((s) => (
            <div
              key={s.id}
              className="w-[calc(50%-12px)] md:flex-1 md:w-auto flex flex-col items-center text-center gap-3 p-4 bg-white/40 border border-primary/5 hover:border-primary/20 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="p-3 bg-primary/10 text-primary border border-primary/10 rounded-xl">
                {s.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base md:text-lg font-black text-charcoal tracking-tight">
                  {s.title}
                </h4>
                <p className="text-xs text-charcoal/60 font-semibold tracking-wide uppercase">
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
