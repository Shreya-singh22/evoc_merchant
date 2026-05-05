"use client";

import React, { useState, useRef } from "react";
import { Play, Volume2, VolumeX, X, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { ASSETS } from "@/config/assets";
import { useCart } from "@/context/CartContext";

const REELS_DATA = [
  {
    id: "reel-1",
    title: "Grinding wet masala to fine perfection",
    sub: "Indian Spices Demo",
    video: ASSETS.reels.videos[0],
    product: {
      id: "prod_1",
      name: "Ultra-Grind 750W Mixer Grinder",
      price: 3499,
      image: ASSETS.reels.images[0],
    },
  },
  {
    id: "reel-2",
    title: "Cooling large rooms in minutes",
    sub: "Beat the Indian Summer",
    video: ASSETS.reels.videos[1],
    product: {
      id: "prod_2",
      name: "AeroCool Pro Air Cooler",
      price: 8499,
      image: ASSETS.reels.images[1],
    },
  },
  {
    id: "reel-3",
    title: "Effortless garment steaming",
    sub: "The perfect crease-remover",
    video: ASSETS.reels.videos[2],
    product: {
      id: "prod_4",
      name: "Smart Laundry Starter Pack",
      price: 2499,
      image: ASSETS.reels.images[2],
    },
  },
  {
    id: "reel-4",
    title: "Energy efficient BLDC ceiling fan",
    sub: "Whisper-quiet air flow",
    video: ASSETS.reels.videos[3],
    product: {
      id: "prod_5",
      name: "AeroBreeze Ceiling Fan",
      price: 3299,
      image: ASSETS.reels.images[3],
    },
  },
  {
    id: "reel-5",
    title: "Fast boiling for your morning tea",
    sub: "Instant Hot Water",
    video: ASSETS.reels.videos[4],
    product: {
      id: "prod_6",
      name: "Lava Electric Kettle",
      price: 1299,
      image: ASSETS.reels.images[4],
    },
  },
];

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const { addToCart } = useCart();

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
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Active Product Info - matching screenshot layout exactly */}
      <div className="flex flex-col items-center justify-center mt-6 animate-fade-in z-30 relative px-4">
        <h4 className="text-sm md:text-base font-medium text-charcoal text-center tracking-tight mb-2">
          {REELS_DATA[currentIndex].product.name}
        </h4>
        <div className="flex items-center justify-center gap-3 cursor-pointer group" onClick={() => addToCart({...REELS_DATA[currentIndex].product, quantity: 1})}>
          <div className="w-12 h-12 bg-transparent flex items-center justify-center transition-transform group-hover:scale-110">
            <img 
              src={REELS_DATA[currentIndex].product.image} 
              alt={REELS_DATA[currentIndex].product.name}
              className="w-full h-full object-contain drop-shadow-sm" 
            />
          </div>
          <div className="bg-primary text-white p-2 rounded-full shadow-md group-hover:bg-primary/90 group-hover:shadow-lg transition-all flex items-center justify-center">
             <ShoppingCart size={16} />
          </div>
        </div>
      </div>
      
    </section>
  );
}
