"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";


import { api } from "@/lib/api";

export default function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const { cartItems, setIsCartOpen } = useCart();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';

  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur-md border-b border-primary/20 transition-all duration-300 select-none">
      {/* Primary Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Mobile menu and Mega-Menu Trigger */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-charcoal hover:text-primary transition-colors cursor-pointer"
            aria-label="Mobile menu toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex relative">
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center gap-1.5 font-semibold text-charcoal hover:text-primary transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-primary/10 shadow-sm"
            >
              <Menu size={18} className="text-primary" />
              <span>Shop by Category</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 text-charcoal ${isMegaMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMegaMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 bg-transparent"
                  onClick={() => setIsMegaMenuOpen(false)}
                />
                  <div className="absolute top-full left-0 mt-3 bg-white w-64 rounded-xl border border-primary/20 shadow-xl z-20 py-3 overflow-hidden animate-fade-in origin-top">
                    {categories.map((cat) => (
                      <a
                        key={cat}
                        href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="block px-5 py-3 text-sm text-charcoal hover:bg-cream hover:text-primary transition-all font-medium border-b border-gray-50 last:border-0 hover:pl-6 capitalize"
                      >
                        {cat}
                      </a>
                    ))}
                  </div>
              </>
            )}
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <a href={`${BASE_PATH}/`} className="flex items-center group select-none">
            <img 
              src={`${BASE_PATH}/moonstruck-logo.jpg`} 
              alt="Moonstruck Logo" 
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
              style={{ mixBlendMode: 'multiply' }}
              onError={(e) => {
                // Fallback if image isn't in public folder yet
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden text-xl md:text-2xl font-black text-primary tracking-wider uppercase group-hover:scale-105 transition-transform">
              Moonstruck
            </span>
          </a>
        </div>

        {/* Right Nav Icons */}
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-charcoal hover:text-primary transition-all hover:bg-white rounded-full cursor-pointer relative flex items-center group"
          >
            <ShoppingCart size={22} />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] md:text-xs font-black rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-bounce">
                {totalQty}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Nav Row */}
      <div className="hidden md:flex border-t border-primary/10 bg-cream max-w-7xl mx-auto justify-center px-6">
        <nav className="flex items-center gap-10 h-10 select-none">
          <Link
            href="/products"
            className="text-sm font-semibold text-charcoal/80 hover:text-primary tracking-wide transition-colors"
          >
            All Products
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-charcoal/80 hover:text-primary tracking-wide transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/warranty"
            className="text-sm font-semibold text-charcoal/80 hover:text-primary tracking-wide transition-colors"
          >
            Warranty & Service
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-charcoal/80 hover:text-primary tracking-wide transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-primary/20 shadow-xl z-50 py-4 px-6 animate-fade-in">
          <div className="mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
              Categories
            </span>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-2 py-2.5 font-semibold text-charcoal hover:bg-cream hover:text-primary rounded-lg transition-colors border-b border-gray-50 last:border-0 capitalize"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
            <a
              href="#brand-story"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-charcoal/80 hover:text-primary tracking-wide"
            >
              Our Story
            </a>
            <a
              href="#stats"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-charcoal/80 hover:text-primary tracking-wide"
            >
              Warranty Details
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-charcoal/80 hover:text-primary tracking-wide"
            >
              FAQs & Help
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
