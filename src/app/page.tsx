"use client";

import React from "react";

import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValueMarquee from "@/components/ValueMarquee";
import Discover from "@/components/Discover";

import Reels from "@/components/Reels";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProduct from "@/components/FeaturedProduct";
import StatsTrust from "@/components/StatsTrust";

import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { BASE_PATH } from "@/config/assets";

export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen select-none bg-cream text-charcoal pb-14 sm:pb-0">
      {/* Top Promo Bar & Primary Navigation */}
        <div className="sticky top-0 z-40 w-full select-none">
          <PromoBar />
          <Header />
        </div>

        {/* Dynamic Story Driven Homepage Sections */}
        <main className="flex-grow">
          <Hero />
          <ValueMarquee />
          
          {/* CRITICAL Requirement - Reels positioned right after landing hero */}
          <Reels />

          <Discover />

          {/* High Impact Kuro Banner */}
          <div className="w-full mt-16 mb-8 select-none animate-fade-in">
            <img 
              src={`${BASE_PATH}/kuro-banner.png`} 
              alt="Moonstruck Kuro Mixer Grinder Banner" 
              className="w-full h-auto block"
            />
          </div>

          <CategoryShowcase />
          <FeaturedProduct />
          <StatsTrust />

          <Reviews />
          <FAQ />
        </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
