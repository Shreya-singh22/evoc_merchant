"use client";

import React from "react";
import { ShieldCheck, Cpu, Award } from "lucide-react";
import { ASSETS } from "@/config/assets";

export default function BrandStory() {
  return (
    <section id="brand-story" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 bg-white border-y border-primary/5 select-none overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Left Side - Story / Copy */}
        <div className="lg:col-span-7 flex flex-col items-start gap-5 animate-fade-in">
          <span className="text-primary text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Engineering Excellence Since 1994
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
            Built for Indian Kitchens.<br />Engineered to Outlast Trends.
          </h2>
          <div className="space-y-4 text-charcoal/75 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            <p>
              At Moonstruck, engineering is an obsession. We don't believe in quick-turnaround electronics that end up in landfills. Every single mixer grinder, cooler, and steam iron we produce is born from continuous R&D and meticulous structural testing in our advanced in-house facilities.
            </p>
            <p>
              Our manufacturing facilities adhere to strict ISO 9001 and BIS guidelines. From testing copper-wound motors under continuous heavy loads to testing airflow turbulence of our air cooler fans, our quality control team leaves no detail to chance. 
            </p>
            <p>
              Every home appliance goes through 12 stages of rigorous validation. We make sure each component can comfortably withstand voltage fluctuations, peak utility usage, and the dynamic everyday routines of the modern home. 
            </p>
          </div>

          {/* 3 icon-with-label callouts beneath */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-primary/10 pt-6 mt-4 w-full select-none">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/5 text-primary border border-primary/15 rounded-xl">
                <Cpu size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-charcoal">Precision Engineering</h4>
                <p className="text-[11px] text-charcoal/60 leading-tight">Advanced in-house design & R&D</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/5 text-primary border border-primary/15 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-charcoal">Rigorous QC</h4>
                <p className="text-[11px] text-charcoal/60 leading-tight">12 levels of continuous checks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/5 text-primary border border-primary/15 rounded-xl">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-charcoal">Eco-Efficient</h4>
                <p className="text-[11px] text-charcoal/60 leading-tight">BEE Star standard designs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Premium Visual Mosaic */}
        <div className="lg:col-span-5 relative w-full h-[380px] md:h-[500px] animate-fade-in group select-none">
          <div className="absolute inset-0 bg-cream/30 rounded-3xl border border-primary/10 shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Visual Mosaic Container */}
            <div className="grid grid-cols-2 h-full">
              <div className="border-r border-primary/10 p-4 flex items-center justify-center bg-cream/40 overflow-hidden">
                <img
                  src={ASSETS.brandStory.image1}
                  alt="Product development"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="grid grid-rows-2 h-full">
                <div className="border-b border-primary/10 p-4 flex items-center justify-center bg-white overflow-hidden">
                  <img
                    src={ASSETS.brandStory.image2}
                    alt="Precision engineering"
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex items-center justify-center bg-cream/10 overflow-hidden">
                  <video
                    src={ASSETS.brandStory.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
