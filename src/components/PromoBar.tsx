"use client";

import React, { useState, useEffect } from "react";

const PROMOS = [
  "FREE INSTALLATION ON ORDERS ABOVE ₹2999",
  "EXTENDED WARRANTY ON ALL APPLIANCES — AUTO-APPLIED AT CHECKOUT",
  "FREE SHIPPING PAN-INDIA",
];

export default function PromoBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-primary text-white text-xs md:text-sm font-medium py-2.5 text-center px-4 select-none flex items-center justify-center relative overflow-hidden transition-all duration-500 ease-in-out border-b border-primary">
      <div className="animate-fade-in flex items-center justify-center gap-2">
        <span className="tracking-wide uppercase font-semibold leading-relaxed">
          {PROMOS[index]}
        </span>
      </div>
    </div>
  );
}
