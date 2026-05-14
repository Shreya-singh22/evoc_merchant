"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ASSETS } from "@/config/assets";

const REELS_DATA = [
  {
    id: "reel-1",
    title: "Grinding wet masala to fine perfection",
    sub: "Indian Spices Demo",
    category: "Mixer Grinders",
    video: ASSETS.reels.videos[0],
  },
  {
    id: "reel-2",
    title: "Cooling large rooms in minutes",
    sub: "Beat the Indian Summer",
    category: "Air Coolers",
    video: ASSETS.reels.videos[1],
  },
  {
    id: "reel-3",
    title: "Effortless garment steaming",
    sub: "The perfect crease-remover",
    category: "Steam Irons",
    video: ASSETS.reels.videos[2],
  },
  {
    id: "reel-4",
    title: "Energy efficient BLDC ceiling fan",
    sub: "Whisper-quiet air flow",
    category: "Ceiling Fans",
    video: ASSETS.reels.videos[3],
  },
  {
    id: "reel-5",
    title: "Fast boiling for your morning tea",
    sub: "Instant Hot Water",
    category: "Electric Kettles",
    video: ASSETS.reels.videos[4],
  },
];

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REELS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REELS_DATA.length) % REELS_DATA.length);
  };

  const handleReelClick = (idx: number) => {
    if (idx === currentIndex) {
      setIsMuted(!isMuted);
    } else {
      setCurrentIndex(idx);
      setIsMuted(true);
    }
  };

  return (
    <section id="reels" className="py-20 md:py-28 w-full mx-auto px-0 select-none bg-white overflow-hidden flex flex-col items-center">

      {/* 3D Coverflow Carousel Container */}
      <div className="relative w-full max-w-7xl mx-auto h-[450px] md:h-[600px] flex items-center justify-center">

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-40 p-3 md:p-4 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg text-charcoal transition-all cursor-pointer hidden md:block"
          aria-label="Previous reel"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-40 p-3 md:p-4 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg text-charcoal transition-all cursor-pointer hidden md:block"
          aria-label="Next reel"
        >
          <ChevronRight size={24} />
        </button>

        {/* Reels Mapping */}
        {REELS_DATA.map((reel, idx) => {
          const diff = idx - currentIndex;
          let offset = diff;
          const halfLength = Math.floor(REELS_DATA.length / 2);

          if (offset > halfLength) offset -= REELS_DATA.length;
          if (offset < -halfLength) offset += REELS_DATA.length;

          let transform = 'translateX(0) scale(1)';
          let zIndex = 30;
          let opacity = 1;
          let blur = 'blur-none';

          if (offset === 0) {
            transform = 'translateX(0) scale(1)';
            zIndex = 30;
            opacity = 1;
            blur = 'blur-none';
          } else if (offset === -1) {
            transform = 'translateX(-65%) scale(0.85)';
            zIndex = 20;
            opacity = 0.85;
            blur = 'blur-[2px]';
          } else if (offset === 1) {
            transform = 'translateX(65%) scale(0.85)';
            zIndex = 20;
            opacity = 0.85;
            blur = 'blur-[2px]';
          } else if (offset === -2) {
            transform = 'translateX(-130%) scale(0.7)';
            zIndex = 10;
            opacity = 0.5;
            blur = 'blur-[4px]';
          } else if (offset === 2) {
            transform = 'translateX(130%) scale(0.7)';
            zIndex = 10;
            opacity = 0.5;
            blur = 'blur-[4px]';
          } else {
            transform = `translateX(${offset < 0 ? '-200%' : '200%'}) scale(0.5)`;
            zIndex = 0;
            opacity = 0;
            blur = 'blur-[8px]';
          }

          return (
            <div
              key={reel.id}
              onClick={() => handleReelClick(idx)}
              className={`absolute w-[260px] md:w-[320px] h-[400px] md:h-[500px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-2xl bg-black ${blur}`}
              style={{ transform, zIndex, opacity }}
            >
              {/* Mute icon for active reel overlay */}
              {offset === 0 && (
                <div className="absolute top-4 right-4 z-20 bg-black/30 p-2 rounded-full text-white backdrop-blur-md">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </div>
              )}

              {/* Video Player */}
              <video
                src={reel.video}
                autoPlay
                muted={offset !== 0 ? true : isMuted}
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Active Reel Caption + Shop Category CTA */}
      <div className="flex flex-col items-center justify-center mt-6 animate-fade-in z-30 relative px-4">
        <span className="text-[10px] md:text-xs text-primary font-black tracking-widest uppercase mb-1">
          {REELS_DATA[currentIndex].sub}
        </span>
        <h4 className="text-sm md:text-base font-medium text-charcoal text-center tracking-tight mb-3">
          {REELS_DATA[currentIndex].title}
        </h4>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <ShoppingBag size={14} />
          Shop {REELS_DATA[currentIndex].category}
        </Link>
      </div>

    </section>
  );
}
