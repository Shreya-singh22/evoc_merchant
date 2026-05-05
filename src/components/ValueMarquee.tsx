"use client";

import React from "react";

const VALUES = [
  "ISI CERTIFIED",
  "2-YEAR WARRANTY",
  "24/7 SUPPORT",
  "MADE IN INDIA",
  "FREE INSTALLATION",
  "FAST DELIVERY",
];

export default function ValueMarquee() {
  return (
    <div className="bg-primary/5 border-y border-primary/20 py-4 w-full overflow-hidden flex select-none">
      <div className="flex w-max animate-marquee gap-12 text-center items-center">
        {/* First set of texts */}
        {VALUES.map((val, idx) => (
          <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs md:text-sm font-black text-primary uppercase tracking-widest">
              {val}
            </span>
            <span className="text-primary/30 mx-4 font-bold text-lg">•</span>
          </div>
        ))}
        {/* Repeated text for seamless infinite scroll */}
        {VALUES.map((val, idx) => (
          <div key={`dup-${idx}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs md:text-sm font-black text-primary uppercase tracking-widest">
              {val}
            </span>
            <span className="text-primary/30 mx-4 font-bold text-lg">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
