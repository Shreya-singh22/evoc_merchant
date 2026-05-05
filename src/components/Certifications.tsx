"use client";

import React from "react";

const CERTIFICATIONS = [
  "ISO 9001",
  "BEE STAR STANDARD",
  "MAKE IN INDIA",
  "ISI SAFETY CERTIFIED",
  "BIS STANDARDS",
  "MeitY COMPLIANT",
];

export default function Certifications() {
  return (
    <section className="bg-primary/5 py-8 border-y border-primary/10 select-none overflow-hidden flex w-full">
      <div className="flex w-max animate-marquee gap-16 items-center select-none">
        {/* Logos & Text first set */}
        {CERTIFICATIONS.map((cert, idx) => (
          <div key={idx} className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-sm md:text-base font-black text-primary/80 uppercase tracking-widest flex items-center gap-2">
              {cert}
            </span>
            <span className="text-primary/20 mx-4 font-bold text-lg">•</span>
          </div>
        ))}
        {/* Duplicates for infinite scrolling loop */}
        {CERTIFICATIONS.map((cert, idx) => (
          <div key={`dup-${idx}`} className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-sm md:text-base font-black text-primary/80 uppercase tracking-widest flex items-center gap-2">
              {cert}
            </span>
            <span className="text-primary/20 mx-4 font-bold text-lg">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
