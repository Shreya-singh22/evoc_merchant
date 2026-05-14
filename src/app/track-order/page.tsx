"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Search,
  HelpCircle,
} from "lucide-react";

import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

// NOTE: This tracking form is UI-only. No backend wiring — values entered here
// produce a mock timeline so the page can be reviewed end-to-end before APIs land.

type ContactMode = "email" | "phone";

interface TrackingResult {
  orderNumber: string;
  contactValue: string;
  contactMode: ContactMode;
}

interface TimelineStep {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  meta: string;
  status: "complete" | "current" | "pending";
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contactMode, setContactMode] = useState<ContactMode>("email");
  const [contactValue, setContactValue] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim() === "" || contactValue.trim() === "") return;
    setResult({
      orderNumber: orderNumber.trim(),
      contactValue: contactValue.trim(),
      contactMode,
    });
  };

  const handleReset = () => {
    setResult(null);
    setOrderNumber("");
    setContactValue("");
  };

  const steps: TimelineStep[] = [
    {
      key: "placed",
      label: "Order Placed",
      icon: CheckCircle2,
      meta: "Mon, 11 May • 09:42 AM",
      status: "complete",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      icon: ShieldCheck,
      meta: "Mon, 11 May • 10:18 AM",
      status: "complete",
    },
    {
      key: "packed",
      label: "Packed",
      icon: Package,
      meta: "Mon, 11 May • 04:55 PM",
      status: "complete",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: Truck,
      meta: "Tue, 12 May • 08:10 AM • In transit via Delhivery",
      status: "current",
    },
    {
      key: "delivery",
      label: "Out for Delivery",
      icon: MapPin,
      meta: "Expected: Wed, 14 May",
      status: "pending",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen select-none bg-cream text-charcoal pb-14 sm:pb-0">
      <div className="sticky top-0 z-40 w-full select-none">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow">
        {/* Hero band */}
        <section className="py-20 md:py-28 max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-4 animate-fade-in">
            <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Order Tracking
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.1]">
              Where&apos;s My Order?
            </h1>
            <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-xl">
              Enter your order number along with the email or phone used at checkout. We&apos;ll pull up
              the latest movement straight from our logistics partners — usually updated within an hour.
            </p>
          </div>
        </section>

        {/* Tracking form card */}
        <section className="pb-12 max-w-3xl mx-auto px-4 md:px-6">
          <div className="bg-white border border-primary/10 rounded-2xl shadow-sm p-6 md:p-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                <Search size={18} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/50">
                  Locate Your Order
                </span>
                <h2 className="text-xl md:text-2xl font-black text-charcoal tracking-tight">
                  Quick Order Lookup
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Order number */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="order-number"
                  className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/60"
                >
                  Order Number
                </label>
                <input
                  id="order-number"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., MS-ORD-48217"
                  required
                  className="bg-cream/40 text-charcoal text-sm md:text-base px-5 py-4 rounded-xl border border-primary/15 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-charcoal/35"
                />
                <span className="text-[11px] text-charcoal/45 font-semibold">
                  Find this in your order confirmation email or invoice PDF.
                </span>
              </div>

              {/* Contact mode toggle */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/60">
                  Verify With
                </span>
                <div className="flex bg-cream/50 p-1 rounded-xl border border-primary/10 w-full sm:w-fit">
                  <label
                    className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-black tracking-wide transition-all ${
                      contactMode === "email"
                        ? "bg-primary text-white shadow-sm"
                        : "text-charcoal/70 hover:text-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact-mode"
                      value="email"
                      checked={contactMode === "email"}
                      onChange={() => {
                        setContactMode("email");
                        setContactValue("");
                      }}
                      className="sr-only"
                    />
                    <Mail size={14} /> Email
                  </label>
                  <label
                    className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-black tracking-wide transition-all ${
                      contactMode === "phone"
                        ? "bg-primary text-white shadow-sm"
                        : "text-charcoal/70 hover:text-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact-mode"
                      value="phone"
                      checked={contactMode === "phone"}
                      onChange={() => {
                        setContactMode("phone");
                        setContactValue("");
                      }}
                      className="sr-only"
                    />
                    <Phone size={14} /> Phone
                  </label>
                </div>
              </div>

              {/* Contact value */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-value"
                  className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/60"
                >
                  {contactMode === "email" ? "Email Address" : "Phone Number"}
                </label>
                <input
                  id="contact-value"
                  type={contactMode === "email" ? "email" : "tel"}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    contactMode === "email"
                      ? "name@example.com"
                      : "+91 98xxx xxxxx"
                  }
                  required
                  className="bg-cream/40 text-charcoal text-sm md:text-base px-5 py-4 rounded-xl border border-primary/15 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-charcoal/35"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full text-center bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md"
              >
                Track Order
              </button>

              <span className="text-[10px] text-charcoal/40 font-bold tracking-wide text-center">
                We never share your contact details. Lookups are encrypted in transit.
              </span>
            </form>
          </div>
        </section>

        {/* Result panel (conditional) */}
        {result && (
          <section className="pb-12 max-w-3xl mx-auto px-4 md:px-6 animate-fade-in">
            <div className="bg-white border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
              {/* Summary header */}
              <div className="bg-cream/60 border-b border-primary/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary">
                    Live Status
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-charcoal tracking-tight">
                    Order #{result.orderNumber}
                  </h3>
                  <p className="text-xs md:text-sm text-charcoal/60 font-semibold">
                    Updates sent to{" "}
                    <span className="text-charcoal">{result.contactValue}</span>
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="self-start md:self-center text-xs md:text-sm font-black text-charcoal/70 hover:text-primary border border-charcoal/15 hover:border-primary/40 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Track Another
                </button>
              </div>

              {/* Mock metadata grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-primary/10">
                <div className="p-5 md:p-6 border-b sm:border-b-0 sm:border-r border-primary/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/45">
                    Carrier
                  </span>
                  <p className="text-sm md:text-base font-black text-charcoal mt-1">
                    Delhivery
                  </p>
                </div>
                <div className="p-5 md:p-6 border-b sm:border-b-0 sm:border-r border-primary/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/45">
                    Tracking ID
                  </span>
                  <p className="text-sm md:text-base font-black text-charcoal mt-1">
                    DLH-728193044
                  </p>
                </div>
                <div className="p-5 md:p-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/45">
                    ETA
                  </span>
                  <p className="text-sm md:text-base font-black text-forest mt-1 flex items-center gap-1.5">
                    <Clock size={14} /> 2 working days
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 md:p-10">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/50 mb-6 block">
                  Shipment Timeline
                </span>
                <ol className="flex flex-col">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isLast = idx === steps.length - 1;
                    const isComplete = step.status === "complete";
                    const isCurrent = step.status === "current";
                    const isPending = step.status === "pending";

                    const dotClasses = isComplete
                      ? "bg-forest text-white border-forest"
                      : isCurrent
                      ? "bg-primary text-white border-primary ring-4 ring-primary/15 animate-pulse"
                      : "bg-cream text-charcoal/30 border-charcoal/20";

                    const connectorClasses = isLast
                      ? "hidden"
                      : isComplete
                      ? "bg-forest/60"
                      : "bg-charcoal/15";

                    const labelClasses = isPending
                      ? "text-charcoal/40"
                      : "text-charcoal";

                    return (
                      <li key={step.key} className="flex gap-4 md:gap-5 relative">
                        {/* Dot + connector column */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${dotClasses}`}
                          >
                            <Icon size={18} />
                          </div>
                          <div
                            className={`w-0.5 flex-grow my-1.5 min-h-[28px] ${connectorClasses}`}
                          />
                        </div>

                        {/* Body */}
                        <div className={`pb-8 flex flex-col gap-1 ${isLast ? "pb-0" : ""}`}>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className={`text-base md:text-lg font-black tracking-tight ${labelClasses}`}>
                              {step.label}
                            </h4>
                            {isComplete && (
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-forest bg-forest/10 border border-forest/20 px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                                In Progress
                              </span>
                            )}
                            {isPending && (
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-charcoal/50 bg-charcoal/5 border border-charcoal/15 px-2 py-0.5 rounded-full">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs md:text-sm font-semibold ${
                              isPending ? "text-charcoal/40" : "text-charcoal/65"
                            }`}
                          >
                            {step.meta}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Footer note */}
              <div className="bg-primary/5 border-t border-primary/10 p-5 md:p-6 flex items-start gap-3">
                <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-charcoal/70 font-semibold leading-relaxed">
                  Your shipment is covered under Moonstruck&apos;s Safe Delivery Promise. If there&apos;s
                  any damage on arrival, raise a claim within 48 hours and we&apos;ll arrange a no-cost
                  replacement.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Help band */}
        <section className="py-20 md:py-28 max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-cream/50 border border-primary/10 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-[radial-gradient(#C8102E_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.025]" />

            <div className="flex-1 flex flex-col items-start gap-3 relative z-10">
              <span className="bg-primary/10 text-primary border border-primary/15 text-[10px] md:text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-2">
                <HelpCircle size={12} /> Need a hand?
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
                Can&apos;t find your order?
              </h2>
              <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-lg">
                Sometimes the confirmation email lands in spam, or the number gets autofilled wrong.
                Our care team will pull up your order in under two minutes — promise.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 relative z-10">
              <Link
                href="/contact"
                className="text-center bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base px-8 py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md"
              >
                Contact Support
              </Link>
              <a
                href="tel:+918001001122"
                className="text-center bg-white text-charcoal hover:text-primary border border-charcoal/15 hover:border-primary/40 font-black text-sm md:text-base px-8 py-4 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Phone size={16} /> 1800-200-1122
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
