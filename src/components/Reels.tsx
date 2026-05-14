"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [windowWidth, setWindowWidth] = useState(1200);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  const isMobile = windowWidth <= 640;
  const isTablet = windowWidth > 640 && windowWidth <= 1024;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % REELS_DATA.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + REELS_DATA.length) % REELS_DATA.length);

  const handleReelClick = (idx: number) => {
    if (idx === currentIndex) {
      setIsMuted(!isMuted);
    } else {
      setCurrentIndex(idx);
      setIsMuted(true);
    }
  };

  // Swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  return (
    <section 
      id="reels" 
      ref={sectionRef}
      className="py-12 md:py-28 w-full mx-auto px-0 select-none bg-white overflow-hidden flex flex-col items-center"
    >
      <div 
        className="relative w-full max-w-7xl mx-auto h-[65vh] max-h-[500px] md:h-[600px] flex items-center justify-center overflow-visible"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {/* Desktop Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg text-charcoal transition-all cursor-pointer hidden md:flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Previous reel"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg text-charcoal transition-all cursor-pointer hidden md:flex items-center justify-center min-w-[44px] min-h-[44px]"
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
            transform = `translateX(${isMobile ? '-105%' : isTablet ? '-90%' : '-65%'}) scale(${isMobile ? 0.9 : 0.85})`;
            zIndex = 20;
            opacity = isMobile ? 0.5 : 0.85;
            blur = 'blur-[2px]';
          } else if (offset === 1) {
            transform = `translateX(${isMobile ? '105%' : isTablet ? '90%' : '65%'}) scale(${isMobile ? 0.9 : 0.85})`;
            zIndex = 20;
            opacity = isMobile ? 0.5 : 0.85;
            blur = 'blur-[2px]';
          } else if (offset === -2) {
            transform = `translateX(${isMobile || isTablet ? '-200%' : '-130%'}) scale(${isMobile || isTablet ? 0.5 : 0.7})`;
            zIndex = 10;
            opacity = isMobile || isTablet ? 0 : 0.5;
            blur = 'blur-[4px]';
          } else if (offset === 2) {
            transform = `translateX(${isMobile || isTablet ? '200%' : '130%'}) scale(${isMobile || isTablet ? 0.5 : 0.7})`;
            zIndex = 10;
            opacity = isMobile || isTablet ? 0 : 0.5;
            blur = 'blur-[4px]';
          }

          return (
            <VideoCard 
              key={reel.id}
              reel={reel}
              offset={offset}
              isMuted={isMuted}
              inView={inView}
              transform={transform}
              zIndex={zIndex}
              opacity={opacity}
              blur={blur}
              onToggleMute={() => setIsMuted(!isMuted)}
              onClick={() => handleReelClick(idx)}
            />
          );
        })}
      </div>

      {/* Mobile Controls (Arrows & Dots) */}
      <div className="flex items-center justify-between gap-4 mt-6 px-6 w-full max-w-[320px] md:hidden z-30 relative">
        <button
          onClick={handlePrev}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-100 active:bg-gray-200 rounded-full shadow-sm text-charcoal transition-colors"
          aria-label="Previous reel"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex gap-2 items-center">
          {REELS_DATA.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === currentIndex ? 'bg-primary w-4' : 'bg-gray-300 w-2'}`} />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-100 active:bg-gray-200 rounded-full shadow-sm text-charcoal transition-colors"
          aria-label="Next reel"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Desktop Dots */}
      <div className="hidden md:flex gap-2 mt-8 mb-4 z-30 relative">
        {REELS_DATA.map((_, i) => (
          <div key={i} className={`h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-primary w-6' : 'bg-gray-300 w-2.5'}`} />
        ))}
      </div>

      {/* Active Reel Caption + Shop Category CTA */}
      <div className="flex flex-col items-center justify-center mt-6 md:mt-4 animate-fade-in z-30 relative px-4">
        <span className="text-[10px] md:text-xs text-primary font-black tracking-widest uppercase mb-1">
          {REELS_DATA[currentIndex].sub}
        </span>
        <h4 className="text-sm md:text-base font-medium text-charcoal text-center tracking-tight mb-4">
          {REELS_DATA[currentIndex].title}
        </h4>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-xs md:text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[44px]"
        >
          <ShoppingBag size={14} />
          Shop {REELS_DATA[currentIndex].category}
        </Link>
      </div>
    </section>
  );
}

// Sub-component for individual videos to handle refs and play state cleanly
function VideoCard({ reel, offset, isMuted, inView, transform, zIndex, opacity, blur, onToggleMute, onClick }: any) {
  const isActive = offset === 0;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <div
      onClick={onClick}
      className={`absolute w-[calc(100vw-64px)] max-w-[320px] aspect-[9/16] h-auto max-h-[65vh] md:max-h-none md:h-[500px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-2xl bg-black ${blur}`}
      style={{ transform, zIndex, opacity }}
    >
      {/* Mute icon for active reel overlay - 44x44 tap target */}
      {isActive && (
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
          className="absolute top-4 right-4 z-50 bg-black/40 hover:bg-black/60 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white backdrop-blur-md transition-colors"
          aria-label="Toggle mute"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Video Player */}
      {inView && (
        <video
          ref={videoRef}
          src={reel.video}
          muted={!isActive || isMuted}
          loop
          playsInline
          preload={isActive ? "auto" : "metadata"}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
