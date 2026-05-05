"use client";

import React from "react";

import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValueMarquee from "@/components/ValueMarquee";
import Discover from "@/components/Discover";
import BrandStory from "@/components/BrandStory";
import Reels from "@/components/Reels";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProduct from "@/components/FeaturedProduct";
import StatsTrust from "@/components/StatsTrust";

import Certifications from "@/components/Certifications";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

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
          <BrandStory />
          <CategoryShowcase />
          <FeaturedProduct />
          <StatsTrust />

          <Certifications />
          <Reviews />
          <FAQ />
          <Newsletter />
        </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
