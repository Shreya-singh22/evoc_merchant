"use client";

import React from "react";

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden select-none bg-cream flex">
      {/* Primary Hero Banner Image */}
      <img
        src={`${BASE_PATH}/moonstruck-banner.jpg`}
        alt="Elevate Your Home with Curated Essentials"
        className="w-full aspect-[1600/750] object-cover"
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
