"use client";

import React, { useState, useEffect } from "react";
import { MoveRight } from "lucide-react";
import { ASSETS } from "@/config/assets";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const showcaseItems = (categories || []).slice(0, 6).map((cat, i) => ({
    id: cat,
    title: cat,
    subtitle: "Explore our collection",
    image: ASSETS.categoryShowcase[i % ASSETS.categoryShowcase.length],
    link: `/products?category=${cat}`,
  }));
  return (
    <section id="categories" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 bg-cream/20 select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
        <div className="max-w-xl flex flex-col gap-2">
          <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Curated Essentials
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
            Shop by Category
          </h2>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
            Find the right high-performance electrical appliances for your lifestyle.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {showcaseItems.map((cat) => (
          <Link
            key={cat.id}
            href={cat.link}
            className="group relative h-[300px] md:h-[380px] rounded-2xl overflow-hidden border border-primary/10 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 flex flex-col justify-end cursor-pointer"
          >
            {/* Visual pattern layer overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent group-hover:via-charcoal/40 transition-all duration-500" />

            <img
              src={cat.image}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />

            <div className="relative z-20 p-6 md:p-8 flex flex-col gap-2">
              <span className="text-white/80 font-bold text-xs md:text-sm uppercase tracking-wide">
                {cat.subtitle}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight capitalize">
                {cat.title}
              </h3>
              <div className="flex items-center gap-2 text-white/90 font-black text-sm uppercase tracking-wider group-hover:text-primary transition-colors mt-2">
                <span>Shop Collection</span>
                <MoveRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
