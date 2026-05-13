"use client";

import React, { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    id: "returns",
    question: "What is your replacement or return policy?",
    answer:
      "We offer a 10-day Hassle-Free Replacement Policy from the date of delivery. If your appliance arrives damaged, defective, or with any issue, we will replace the unit or the specific part immediately at no additional cost. Items must be returned in original packaging with the invoice and all accessories.",
  },
  {
    id: "privacy",
    question: "What is your privacy policy?",
    answer:
      "We only collect the information necessary to deliver your order, register your warranty, and improve our products — contact details, addresses, and purchase history. We never sell or rent your personal data to third parties. Payment information is processed via PCI-DSS compliant gateways and is never stored on our servers. You can request a copy or deletion of your data anytime by writing to care@moonstruck.co.in.",
  },
  {
    id: "terms",
    question: "What are your terms of service?",
    answer:
      "By placing an order on Moonstruck, you agree that the product details, pricing, and stock shown on our site are accurate to the best of our knowledge but may be updated at any time. Orders are accepted only after payment confirmation and stock verification. Warranty terms apply only to products purchased from Moonstruck.co.in or our authorized retailers — please retain your invoice. All disputes are subject to the jurisdiction of courts in Mumbai, MH.",
  },
  {
    id: "shipping",
    question: "What is your shipping policy?",
    answer:
      "We ship pan-India with our trusted logistics partners. Metro orders are typically delivered within 2–4 working days, and the rest of India within 5–8 working days. Shipping is free on all orders above ₹999. You can track your package live from the Track Your Order page, and our team will share an SMS/WhatsApp update at every stage.",
  },
  {
    id: "refunds",
    question: "What is your refund policy?",
    answer:
      "Approved refunds are processed within 5–7 working days of us receiving the returned product. Refunds are credited back to the original payment method — UPI, card, or net banking — and you'll get a confirmation by email and SMS. For Cash on Delivery orders, refunds are processed via bank transfer once your bank account details are shared with our support team.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("returns");

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const match = FAQS.find((f) => f.id === hash);
      if (!match) return;
      setOpenId(match.id);
      const el = document.getElementById(match.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const toggle = (id: string) => {
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
              id={faq.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 scroll-mt-32 ${
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
