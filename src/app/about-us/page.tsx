"use client";

import React, { useState, useEffect, useRef } from "react";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Star, ShieldCheck, ChevronLeft, ChevronRight, Truck, Award, CheckCircle2, Zap, Heart, Mail, Phone, MapPin, ChevronDown, ChevronUp, Quote } from "lucide-react";


// Animated Number Hook
const AnimatedCounter = ({ target, suffix = "", duration = 1500 }: { target: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
};

export default function AboutUs() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeReview, setActiveReview] = useState(0);

  const STATS = [
    { label: "Happy Customers", value: 98, suffix: "%" },
    { label: "Retail Outlets", value: 500, suffix: "+" },
    { label: "Products", value: 200, suffix: "+" },
    { label: "Customers Served", value: 1000000, suffix: "+" },
    { label: "Team Members", value: 150, suffix: "+" }
  ];

  const WHY_CHOOSE_US = [
    {
      title: "Built for Indian Kitchens",
      icon: <Zap className="text-primary" size={24} />,
      desc: "Designed explicitly to handle robust daily Indian cooking routines, heavy masalas, and voltage fluctuations."
    },
    {
      title: "Trusted Warranty",
      icon: <ShieldCheck className="text-primary" size={24} />,
      desc: "Comes with a comprehensive 2-Year standard warranty with extended coverage options for peace of mind."
    },
    {
      title: "Fast Delivery",
      icon: <Truck className="text-primary" size={24} />,
      desc: "Dispatched within 24-48 hours, offering lightning fast reliable shipping across the entire nation."
    },
    {
      title: "Premium Build Quality",
      icon: <Award className="text-primary" size={24} />,
      desc: "Built using robust 100% copper wound motors and 304-grade stainless steel components for maximum lifetime."
    }
  ];

  const TESTIMONIALS = [
    {
      text: "Moonstruck mixer grinder has been a game-changer in my kitchen. Powerful and built to last.",
      author: "Ritesh Aggarwal",
      role: "Verified Buyer",
      location: "Delhi"
    },
    {
      text: "Fast shipping and great customer support. Truly built for Indian cooking.",
      author: "Kavita Mehra",
      role: "Verified Buyer",
      location: "Mumbai"
    },
    {
      text: "Excellent service and top-notch appliances. Will definitely keep ordering!",
      author: "Amit Verma",
      role: "Verified Buyer",
      location: "Lucknow"
    }
  ];

  const FAQS = [
    {
      q: "Do your products come with a warranty?",
      a: "Absolutely! Most of our products come with a comprehensive manufacturer's warranty. You can also opt for extended protection plans for extra peace of mind."
    },
    {
      q: "How long will it take to receive my order?",
      a: "Delivery times vary based on your location, but we typically ship within 24–48 hours. You'll receive tracking information as soon as your order is dispatched."
    },
    {
      q: "What is your return policy?",
      a: "We offer a hassle-free return policy. If you're not satisfied with your purchase, you can return it within 6 days for an exchange or refund."
    },
    {
      q: "Do you offer installment payment options?",
      a: "Yes, we partner with trusted payment providers to offer easy financing and installment plans (No-cost EMIs) at checkout."
    }
  ];

  const TEAM = [
    {
      name: "Madhur Jindal",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      desc: "Founded Moonstruck at 18 to revolutionize Indian kitchen technology."
    },
    {
      name: "Priya Sharma",
      role: "Head of Product Engineering",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      desc: "Ensuring ultimate durability and performance for all kitchen models."
    },
    {
      name: "Rajesh Iyer",
      role: "VP of Customer Excellence",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      desc: "Committed to building lifetime trust with reliable post-sales care."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream/30 text-charcoal font-sans select-none">
      <div className="sticky top-0 z-50 w-full">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow overflow-hidden">
        {/* 1. HERO SECTION */}
        <section className="relative h-[60vh] md:h-[70vh] min-h-[500px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80" 
            alt="Premium Kitchen Banner" 
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-[subtle-zoom_20s_ease-in-out_infinite]"
          />
          <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 text-white w-full flex flex-col items-start gap-6">
            <span className="bg-primary/90 text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/20 shadow-lg animate-fade-in">
              About Moonstruck
            </span>
            <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight leading-tight animate-slide-up">
              Power You Can Trust
            </h1>
            <p className="text-lg md:text-2xl font-medium text-white/90 max-w-2xl leading-relaxed drop-shadow-sm animate-slide-up">
              Kitchen appliances genuinely built for Indian kitchens.
            </p>
            <a 
              href={`/products`}
              className="mt-4 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 text-sm md:text-base group"
            >
              Shop Now
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>

        {/* 2. OUR STORY */}
        <section id="story" className="py-24 max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Our Journey
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-charcoal leading-[1.15]">
                Who We Are
              </h2>
            </div>
            <div className="space-y-5 text-charcoal/80 text-sm md:text-lg leading-relaxed font-medium">
              <p>
                Moonstruck was founded in 2020 by <strong>Madhur Jindal at the age of 18</strong> — with one simple idea: Indian families deserve kitchen appliances that are genuinely built for Indian kitchens, not products designed elsewhere and sold here with a different sticker.
              </p>
              <p>
                We realized that the typical pressure, spice grinding loads, and endurance needed in Indian households demand special attention to copper winding, steel grades, and cooling vents.
              </p>
              <p>
                We started with heavy-duty mixer grinders, and have since grown into a trusted name across comprehensive home and kitchen appliances, keeping authenticity and performance at our core.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 relative group">
            <div className="absolute -inset-4 bg-gold/10 rounded-[2rem] -rotate-2 scale-105 opacity-50" />
            <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] rounded-3xl border border-primary/10 overflow-hidden shadow-2xl p-2 bg-white">
              <img 
                src="https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=800&q=80" 
                alt="Moonstruck Appliance Crafting" 
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </section>

        {/* 3. STATS / NUMBERS BAR */}
        <section className="bg-charcoal text-white py-16 relative overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:32px_32px] opacity-[0.02]" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-fade-in">
                <div className="text-3xl md:text-5xl font-serif font-black text-gold tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest max-w-[120px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. WHY CHOOSE US */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl flex flex-col gap-4 mb-16">
              <span className="text-primary text-xs font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Pure Excellence
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-charcoal leading-[1.15]">
                Fast, Reliable, and Committed to Your Satisfaction.
              </h2>
              <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-2xl">
                Our team consists of highly skilled professionals with extensive training, ensuring top-quality service. We've been committed to excellence since the very beginning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {WHY_CHOOSE_US.map((item, i) => (
                <div key={i} className="flex flex-col gap-4 bg-cream/20 border border-primary/5 p-8 rounded-3xl hover:border-primary/20 shadow-sm hover:shadow-xl transition-all group duration-500">
                  <div className="w-14 h-14 rounded-2xl border border-primary/15 bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <div className="group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mt-2">{item.title}</h3>
                  <p className="text-charcoal/65 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BRAND PROMISE / TAGLINE BANNER */}
        <section className="relative py-24 text-white text-center overflow-hidden bg-charcoal">
          <div className="absolute inset-0 bg-primary/20 z-10 pointer-events-none" />
          <img 
            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80" 
            alt="Crafting Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale mix-blend-luminosity"
          />
          <div className="relative z-20 max-w-4xl mx-auto px-6 flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-12 h-px bg-gold/50" />
            <Quote size={40} className="text-gold opacity-50 rotate-180" />
            <h2 className="text-2xl md:text-5xl font-serif font-medium leading-[1.25] italic text-cream tracking-wide">
              Elevate Your Home with Celestial Craftsmanship.
            </h2>
            <p className="text-gold text-xs md:text-base font-extrabold uppercase tracking-[0.2em] max-w-2xl mt-2">
              Discover the intersection of sophisticated design and cutting-edge technology — only at Moonstruck.
            </p>
            <div className="w-12 h-px bg-gold/50 mt-2" />
          </div>
        </section>

        {/* 6. TESTIMONIALS CAROUSEL */}
        <section className="py-24 max-w-7xl mx-auto px-4 md:px-6 select-none">
          <div className="flex items-end justify-between mb-12">
            <div className="flex flex-col gap-2">
              <span className="text-primary text-xs font-black tracking-widest uppercase">Word of Mouth</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-charcoal">Trusted by Thousands</h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveReview((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-3 bg-white border border-charcoal/10 rounded-full hover:border-primary/40 hover:text-primary shadow-sm cursor-pointer active:scale-95 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setActiveReview((prev) => (prev + 1) % TESTIMONIALS.length)}
                className="p-3 bg-white border border-charcoal/10 rounded-full hover:border-primary/40 hover:text-primary shadow-sm cursor-pointer active:scale-95 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((rev, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col gap-5 bg-white border p-8 rounded-3xl transition-all duration-700 ${
                  idx === activeReview ? "border-primary/30 shadow-2xl scale-[1.02] z-10" : "border-primary/10 opacity-70 scale-[0.98]"
                }`}
              >
                <div className="flex gap-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-gold" />)}
                </div>
                <p className="text-sm md:text-base text-charcoal/80 font-medium italic leading-relaxed">
                  "{rev.text}"
                </p>
                <div className="border-t border-gray-100 pt-4 flex flex-col">
                  <span className="font-black text-sm text-charcoal">{rev.author}</span>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">
                    {rev.role} • {rev.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. MEET THE TEAM */}
        <section className="py-24 bg-cream/30 border-t border-primary/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center flex flex-col items-center gap-3 mb-16">
              <span className="text-primary text-xs font-black tracking-widest uppercase">Faces Behind the Magic</span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-charcoal">Meet Our Leadership</h2>
              <p className="text-charcoal/60 text-sm md:text-base max-w-xl leading-relaxed mt-1">
                The engineering and service minds keeping Indian appliance standards world-class.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {TEAM.map((m, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 transform transition-transform duration-500 group-hover:scale-105 relative bg-white">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-black text-charcoal">{m.name}</h3>
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-widest mt-1 mb-3">
                    {m.role}
                  </span>
                  <p className="text-charcoal/60 text-xs md:text-sm leading-relaxed px-4">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ ACCORDION */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <div className="text-center flex flex-col items-center gap-3 mb-12">
              <span className="text-primary text-xs font-black tracking-widest uppercase">Help & Support</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-charcoal">You've Got Any Questions?</h2>
            </div>

            <div className="flex flex-col gap-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-primary/10 rounded-2xl bg-white overflow-hidden transition-shadow hover:shadow-md">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-cream/20 transition-colors"
                  >
                    <span className="font-bold text-charcoal text-sm md:text-base">{faq.q}</span>
                    {activeFaq === idx ? <ChevronUp size={18} className="text-primary flex-shrink-0 ml-4" /> : <ChevronDown size={18} className="text-charcoal/40 flex-shrink-0 ml-4" />}
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-6 text-charcoal/70 text-sm leading-relaxed border-t border-gray-50 pt-4 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. CONTACT FOOTER BANNER */}
        <section className="py-20 bg-charcoal text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <span className="text-gold text-xs font-black tracking-widest uppercase">Here to Help</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight text-cream">
                Get in Touch With Our Support Team
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md mt-1">
                Have queries regarding ordering, warranties, or bulk supply? Connect with our verified experts now.
              </p>
            </div>
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gold mt-0.5">
                  <MapPin size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Corporate Address</span>
                  <p className="text-sm text-white/85 leading-relaxed font-medium">
                    Plot No. 259, Block F,<br />
                    DSIIDC Industrial Area,<br />
                    Sector 3, Delhi 110039
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gold mt-0.5">
                    <Mail size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Email Assistance</span>
                    <a href="mailto:support@moonstruck.co.in" className="text-sm text-white/90 hover:text-gold transition-colors font-bold">
                      support@moonstruck.co.in
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gold mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Toll Free Call</span>
                    <a href="tel:+918448609059" className="text-sm text-white/90 hover:text-gold transition-colors font-bold">
                      +91 84486 09059
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />

      {/* Inline Animation Styles for Framer-like behavior in Tailwind 4 */}
      <style jsx global>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1.02); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1.02); }
        }
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
          animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
