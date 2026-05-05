"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    id: 1,
    question: "How long is the appliance warranty?",
    answer: "Every single Moonstruck home appliance comes with a complimentary 2-Year Comprehensive warranty. This includes coverage for any structural or internal component failures, motor replacements, and in-house servicing.",
  },
  {
    id: 2,
    question: "Do you provide free installation?",
    answer: "Yes, we provide completely free pan-India installation on all home appliances above orders of ₹2,999. Our authorized technicians will arrive within 24–48 hours of product delivery to complete setup.",
  },
  {
    id: 3,
    question: "What makes your mixer grinder motor heavy duty?",
    answer: "Our heavy duty mixer grinders are equipped with 100% pure copper-wound motors with intelligent overload protection. This delivers much higher torque, less noise, and enhanced efficiency compared to typical aluminum motors.",
  },
  {
    id: 4,
    question: "What is your replacement or return policy?",
    answer: "We offer a 10-day Hassle-Free Replacement Policy. If your appliance arrives damaged, defective, or with any issues, we will replace the unit or specific part immediately at no additional cost.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 max-w-4xl mx-auto px-4 md:px-6 select-none bg-white">
      <div className="flex flex-col items-center text-center gap-2 mb-12 animate-fade-in">
        <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Questions answered
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-xl">
          Everything you need to know about our products, installations, warranty, and returns.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen ? "bg-cream/40 border-primary/25 shadow-md" : "bg-white border-primary/10 hover:border-primary/20"
              }`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between text-left p-5 md:p-6 cursor-pointer select-none"
              >
                <span className="text-sm md:text-base font-black text-charcoal pr-6 leading-tight">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-primary">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out px-5 md:px-6 overflow-hidden ${
                  isOpen ? "max-h-96 pb-5 md:pb-6 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
                }`}
              >
                <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed font-normal">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
