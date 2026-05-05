"use client";

import React from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { ASSETS } from "@/config/assets";

const BLOGS = [
  {
    id: 1,
    title: "How to Pick the Ideal Heavy-Duty Mixer Grinder for Your Kitchen",
    excerpt: "Learn how wattage, motor capacity, and blade profiles play a crucial role in the lifespan of your kitchen mixer grinder.",
    date: "May 2, 2026",
    author: "Rohan Verma",
    image: ASSETS.blog[0],
  },
  {
    id: 2,
    title: "5 Smart Summer Cooling Tips to Lower Your Electric Bill",
    excerpt: "Simple home adjustments and efficient air cooler placement can significantly reduce monthly power costs during heavy summers.",
    date: "April 28, 2026",
    author: "Sneha Rao",
    image: ASSETS.blog[1],
  },
  {
    id: 3,
    title: "The Ultimate Guide to Taking Care of Your Clothes with Steam Irons",
    excerpt: "A basic maintenance how-to guide to prevent calcium build-up in your steam irons and ensure long-term premium performance.",
    date: "April 20, 2026",
    author: "Kabir Singh",
    image: ASSETS.blog[2],
  },
];

export default function BlogArticles() {
  return (
    <section id="articles" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none bg-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
        <div className="max-w-xl flex flex-col gap-2">
          <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> From the Experts
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
            Read Our Appliance Guides
          </h2>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
            Get professional tips on energy savings, appliance choices, recipes, and home performance.
          </p>
        </div>
        <a
          href="#articles"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-black text-sm md:text-base uppercase tracking-wider group transition-all"
        >
          <span>Browse All Articles</span>
          <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {BLOGS.map((b) => (
          <article
            key={b.id}
            className="flex flex-col bg-cream/20 border border-primary/10 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group select-none"
          >
            <div className="relative w-full h-52 md:h-60 overflow-hidden cursor-pointer">
              <img
                src={b.image}
                alt={b.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[10px] text-charcoal font-black px-3 py-1.5 rounded-full shadow-sm tracking-wide flex items-center gap-1.5">
                <BookOpen size={12} className="text-primary" /> Expert Tip
              </span>
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow bg-white border-t border-gray-50">
              <div className="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-widest text-primary/70 uppercase">
                <span>{b.author}</span>
                <span>•</span>
                <span>{b.date}</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-charcoal mb-2 leading-tight group-hover:text-primary transition-colors">
                {b.title}
              </h3>
              <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-normal mb-4">
                {b.excerpt}
              </p>
              <a
                href="#articles"
                className="text-xs md:text-sm font-extrabold text-charcoal hover:text-primary transition-colors tracking-wide flex items-center gap-1.5 group self-start mt-auto cursor-pointer"
              >
                <span>Read Full Guide</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
