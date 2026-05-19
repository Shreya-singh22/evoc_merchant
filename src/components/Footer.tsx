"use client";

import React from "react";
import Link from "next/link";
import { Globe, MessageCircle, Share2, ShieldCheck, Heart } from "lucide-react";
import { BASE_PATH } from "@/config/assets";
export default function Footer() {
  
  return (
    <footer className="bg-charcoal text-white pt-20 pb-8 select-none border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mb-16 select-none animate-fade-in">
        {/* Column 1 - Brand & Contact */}
        <div className="flex flex-col items-start gap-4 lg:col-span-2">
          <a href={`${BASE_PATH}/`} className="flex items-center group select-none mb-2">
            <img 
              src={`${BASE_PATH}/moonstruck-logo.jpg`} 
              alt="Moonstruck Logo" 
              className="h-10 md:h-12 w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
              style={{ filter: "invert(1) hue-rotate(180deg)", mixBlendMode: "screen" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden text-xl font-black tracking-wider uppercase text-white group-hover:scale-105 transition-transform">
              Moonstruck
            </span>
          </a>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed max-w-sm">
            Premium home appliance engineering designed explicitly for Indian homes. Built for durability, safety, and modern performance.
          </p>
          <div className="text-xs md:text-sm text-white/80 flex flex-col gap-1 mt-2">
            <p><strong>Address:</strong> Plot No. 259, Block F, DSIIDC Industrial Area, Sector 3, Delhi 110039</p>
            <p><strong>Support:</strong> support@moonstruck.co.in</p>
            <p><strong>Contact:</strong> +91 97735 50700</p>
          </div>
          <div className="flex items-center gap-3.5 mt-3">
            <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-xl transition-all hover:-translate-y-1 text-white border border-white/10 hover:border-primary">
              <Globe size={18} />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-xl transition-all hover:-translate-y-1 text-white border border-white/10 hover:border-primary">
              <MessageCircle size={18} />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-xl transition-all hover:-translate-y-1 text-white border border-white/10 hover:border-primary">
              <Share2 size={18} />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-xl transition-all hover:-translate-y-1 text-white border border-white/10 hover:border-primary">
              <Heart size={18} />
            </a>
          </div>
        </div>


        {/* Column 2 - Info Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-white/50 border-b border-white/10 pb-2 mb-1">
            Information
          </h3>
          <nav className="flex flex-col gap-3">
            <Link href="/about-us" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">About Us</Link>
            <Link href="/contact-us" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Contact Us</Link>
            <Link href="/blog" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Expert Blog</Link>
            <Link href="/track-order" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Track Your Order</Link>
            <Link href="/warranty" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Warranty Registration</Link>
          </nav>
        </div>

        {/* Column 3 - Policies & Trust */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-white/50 border-b border-white/10 pb-2 mb-1">
            Quick Links
          </h3>
          <nav className="flex flex-col gap-3">
            <Link href="/#privacy" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Privacy Policy</Link>
            <Link href="/#terms" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Terms of Service</Link>
            <Link href="/#shipping" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Shipping Policy</Link>
            <Link href="/#refunds" className="text-sm text-white/70 hover:text-primary hover:pl-1.5 transition-all font-semibold">Refund Policy</Link>
          </nav>
        </div>
      </div>

      {/* Bottom Legal & Payment Strip */}
      <div className="border-t border-white/5 pt-6 mt-4 max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 text-xs md:text-sm text-white/40 font-semibold tracking-wide text-center">
          <span suppressHydrationWarning>&copy; {new Date().getFullYear()} Moonstruck Appliances. All Rights Reserved.</span>
          <span className="hidden md:inline">•</span>
          <a
            href="https://evoclabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 font-bold text-[#29ace4] group transition-all hover:brightness-110 cursor-pointer"
          >
            Powered by
            <img
              src={`${BASE_PATH}/evoclabs-logo.png`}
              alt="EvocLabs Logo"
              className="h-6 md:h-7 w-auto object-contain"
            />
            EvocLabs
          </a>
        </div>

        <div className="flex items-center gap-3.5 opacity-60">
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
            100% Safe Payments
          </span>
          <img src="https://checkout.razorpay.com/v1/checkout.js" alt="" className="hidden" />
        </div>
      </div>
    </footer>
  );
}
