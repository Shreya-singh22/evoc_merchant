"use client";

import React, { useState } from "react";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Mail, Phone, MapPin, Clock, ChevronRight, Send, MessageSquare, CheckCircle2 } from "lucide-react";


export default function ContactUs() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    orderId: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Fake API submit timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", orderId: "", message: "" });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream/30 text-charcoal font-sans select-none">
      <div className="sticky top-0 z-50 w-full">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow pt-8 pb-20 px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="max-w-6xl mx-auto flex items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal/50 mb-8 animate-fade-in">
          <a href={`/`} className="hover:text-primary transition-colors">Home</a>
          <ChevronRight size={10} />
          <span className="text-charcoal font-bold">Contact Us</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4 mb-16 animate-fade-in">
          <div className="w-16 h-16 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary shadow-sm">
            <MessageSquare size={28} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-charcoal tracking-tight">
            Keep In Touch with Us
          </h1>
          <p className="text-charcoal/60 max-w-2xl text-sm md:text-base leading-relaxed font-medium">
            We do not sell product from our corporate headquarters in New York City. If you want to visit please reach out to our customer service team first.
          </p>
        </div>

        {/* Primary Contact Grid Layout (Split Form & Info) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 animate-slide-up">
          
          {/* Col 1: Fast Contacts Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
            {/* Contact Card: Phone */}
            <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 flex gap-5 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-primary/10 text-primary flex-shrink-0 mt-1">
                <Phone size={22} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-charcoal/40 uppercase tracking-wider">Customer Care</span>
                <a href="tel:+1880567891505" className="text-xl font-black text-charcoal hover:text-primary transition-colors leading-snug mt-0.5">
                  +1 (880) 567 891 505
                </a>
                <div className="flex items-center gap-1.5 text-xs text-charcoal/60 mt-1 font-semibold">
                  <Clock size={12} className="text-primary" />
                  Monday - Friday: 8:00-20:00
                </div>
              </div>
            </div>

            {/* Contact Card: Email */}
            <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 flex gap-5 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-primary/10 text-primary flex-shrink-0 mt-1">
                <Mail size={22} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-charcoal/40 uppercase tracking-wider">Email Assistance</span>
                <a href="mailto:electrozsupport@mail.com" className="text-lg md:text-xl font-black text-charcoal hover:text-primary transition-colors leading-snug mt-0.5">
                  electrozsupport@mail.com
                </a>
                <p className="text-xs text-charcoal/60 font-semibold mt-1">
                  Expected reply window: within 24 hours.
                </p>
              </div>
            </div>

            {/* Contact Card: Corporate Address */}
            <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 flex gap-5 items-start shadow-sm hover:shadow-md transition-shadow flex-grow">
              <div className="p-3.5 rounded-2xl bg-cream/30 border border-primary/10 text-primary flex-shrink-0 mt-1">
                <MapPin size={22} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-charcoal/40 uppercase tracking-wider">Corporate Address</span>
                <p className="text-base font-black text-charcoal mt-1 leading-relaxed">
                  Sydney road, Billboard Street 2219-11C
                </p>
                <span className="text-[10px] bg-primary/5 text-primary font-bold border border-primary/10 px-3 py-1 rounded-full mt-3 self-start uppercase">
                  Corporate Headquarters (NYC)
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Dynamic Contact Form Container */}
          <div className="lg:col-span-7 bg-white border border-primary/10 shadow-xl rounded-[2rem] p-6 md:p-10 order-1 lg:order-2 flex flex-col justify-between">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 gap-5 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-black text-charcoal">Message Sent Successfully!</h3>
                <p className="text-charcoal/60 max-w-sm leading-relaxed font-semibold">
                  Thank you for reaching out! A support manager has been assigned to your inquiry and will revert within **24 hours**.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 border border-charcoal/20 hover:border-primary hover:text-primary font-extrabold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full animate-fade-in">
                <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal border-b border-gray-50 pb-3">
                  Drop Us a Line
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[10px] font-extrabold text-charcoal/50 uppercase tracking-wider">Your Full Name *</label>
                    <input 
                      id="name"
                      type="text" 
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      placeholder="Rakesh Sharma" 
                      className="w-full bg-cream/10 border border-charcoal/10 focus:border-primary outline-none rounded-xl px-4 py-3 text-sm transition-all font-medium placeholder-charcoal/30"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] font-extrabold text-charcoal/50 uppercase tracking-wider">Email Address *</label>
                    <input 
                      id="email"
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      placeholder="rakesh@gmail.com" 
                      className="w-full bg-cream/10 border border-charcoal/10 focus:border-primary outline-none rounded-xl px-4 py-3 text-sm transition-all font-medium placeholder-charcoal/30"
                    />
                  </div>
                </div>

                {/* Order ID input (optional) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orderId" className="text-[10px] font-extrabold text-charcoal/50 uppercase tracking-wider">Order ID (Optional)</label>
                  <input 
                    id="orderId"
                    type="text" 
                    value={formState.orderId}
                    onChange={(e) => setFormState({...formState, orderId: e.target.value})}
                    placeholder="e.g. #MN-9201" 
                    className="w-full bg-cream/10 border border-charcoal/10 focus:border-primary outline-none rounded-xl px-4 py-3 text-sm transition-all font-medium placeholder-charcoal/30"
                  />
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-1.5 flex-grow">
                  <label htmlFor="message" className="text-[10px] font-extrabold text-charcoal/50 uppercase tracking-wider">Message Body *</label>
                  <textarea 
                    id="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    placeholder="Write details regarding your query or concern..." 
                    className="w-full bg-cream/10 border border-charcoal/10 focus:border-primary outline-none rounded-xl px-4 py-4 text-sm transition-all font-medium placeholder-charcoal/30 resize-none flex-grow min-h-[120px]"
                  />
                </div>

                {/* Disclaimer Text */}
                <p className="text-[11px] text-charcoal/40 leading-relaxed">
                  By submitting this form, you agree to be contacted by the Moonstruck support department in relation to your inquiry. View our <a href={`/privacy-policy`} className="underline hover:text-primary font-bold">Privacy Policy</a>.
                </p>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/95 disabled:bg-gray-300 text-white font-black uppercase tracking-widest text-xs md:text-sm py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Transmitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={14} />
                      Send Message Now
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
