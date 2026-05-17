import React from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  IndianRupee,
  Wrench,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Quote,
} from "lucide-react";

import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata = {
  title: "About Us | Moonstruck Appliances",
  description:
    "Premium home appliance engineering designed explicitly for Indian homes. Built for durability, safety, and modern performance.",
};

const VALUES: Array<{
  icon: React.ReactNode;
  title: string;
  body: string;
}> = [
  {
    icon: <Cpu size={26} />,
    title: "Engineering First",
    body: "Every model starts on a CAD bench, not a marketing brief. Our R&D team validates motor torque, thermal load, and component tolerance before a single SKU enters production.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Built To Last",
    body: "We design for a ten-year service life on a five-year warranty promise. Pure copper windings, food-grade polycarbonate housings, and BIS-rated wiring across every product line.",
  },
  {
    icon: <IndianRupee size={26} />,
    title: "Honest Pricing",
    body: "No inflated MRPs, no festive theatre. We sell direct, cut three layers of distribution, and pass the saving to you. The sticker you see is the price the product is worth.",
  },
  {
    icon: <Wrench size={26} />,
    title: "Service That Shows Up",
    body: "412 authorised service centres across 28 states. Average on-site response inside metro pin codes is under 48 hours, and every visit is logged on a customer-visible ticket.",
  },
];

const STATS: Array<{ value: string; label: string; sub: string }> = [
  { value: "18", label: "Years In Business", sub: "Founded 2007 in Pune" },
  { value: "4.6M+", label: "Units Shipped", sub: "Across India" },
  { value: "412", label: "Service Centres", sub: "Pan-India network" },
  { value: "71%", label: "Repeat Customers", sub: "On 5-yr cohort data" },
];

const LEADERSHIP: Array<{
  name: string;
  role: string;
  bio: string;
  initials: string;
  accent: string;
}> = [
  {
    name: "Aarav Deshmukh",
    role: "Founder & CEO",
    bio: "Mechanical engineer (IIT Bombay, '02). Spent eight years on motor design at Bajaj Electricals before starting Moonstruck out of a leased shed in Pimpri.",
    initials: "AD",
    accent: "bg-primary/10 text-primary border-primary/20",
  },
  {
    name: "Ishita Raghavan",
    role: "Head of Engineering",
    bio: "Leads our 64-person R&D team in Pune. Holds 11 patents across induction cooktop topology and brushless DC motor controllers. Previously at Whirlpool India.",
    initials: "IR",
    accent: "bg-forest/10 text-forest border-forest/20",
  },
  {
    name: "Karthik Menon",
    role: "Head of Customer Experience",
    bio: "Runs the service network and the care@moonstruck inbox. Reads every escalation personally. Believes a warranty is a contract, not a marketing line.",
    initials: "KM",
    accent: "bg-gold/15 text-charcoal border-gold/30",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen select-none bg-cream text-charcoal pb-14 sm:pb-0">
      <div className="sticky top-0 z-40 w-full select-none">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow">
        {/* 1. HERO BAND */}
        <section className="relative overflow-hidden border-b border-primary/10 bg-cream">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in">
                <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Our Story
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-charcoal tracking-tight leading-[1.05]">
                  Crafted For The
                  <br />
                  <span className="text-primary">Indian Home.</span>
                </h1>
                <p className="text-charcoal/75 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
                  Moonstruck builds home appliances the way they used to be built &mdash;
                  with copper, steel, and an obsession for the details that survive a
                  monsoon, a Mumbai summer, and a household of four. We are an
                  engineering company that happens to sell to consumers.
                </p>

                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-charcoal/70 bg-white border border-primary/15 rounded-full px-4 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest" /> BIS &amp; ISI Certified
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-charcoal/70 bg-white border border-primary/15 rounded-full px-4 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" /> 5-Year Warranty
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-charcoal/70 bg-white border border-primary/15 rounded-full px-4 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Made In Pune
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 relative w-full h-[360px] md:h-[480px] animate-fade-in group">
                <div className="absolute inset-0 bg-cream/40 rounded-3xl border border-primary/10 shadow-sm overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80"
                    alt="A modern Indian kitchen with premium appliances"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white border border-primary/10 rounded-2xl p-4 shadow-lg max-w-[230px] hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/15">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/50">
                        Validated To
                      </p>
                      <p className="text-sm font-black text-charcoal">
                        140V&ndash;280V Range
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MISSION STATEMENT */}
        <section className="py-20 md:py-28 bg-white border-b border-primary/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
              <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Our Mission
              </span>
              <Quote
                size={40}
                className="text-primary/30"
                aria-hidden="true"
              />
              <p className="text-2xl md:text-4xl lg:text-5xl font-black text-charcoal tracking-tight leading-[1.2]">
                To build the most reliable, repairable, and{" "}
                <span className="text-primary">honestly engineered</span> home
                appliances in India &mdash; and to stand behind every one of them
                long after the box has been thrown out.
              </p>
              <div className="h-px w-24 bg-primary/30 mt-4" />
              <p className="text-charcoal/60 text-sm md:text-base font-semibold tracking-wide uppercase">
                &mdash; The Moonstruck Charter, 2007
              </p>
            </div>
          </div>
        </section>

        {/* 3. OUR STORY */}
        <section className="py-20 md:py-28 bg-cream/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 flex flex-col gap-5 animate-fade-in">
                <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> The Origin
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
                  Started By Engineers.
                  <br />
                  Run The Same Way.
                </h2>
                <div className="space-y-5 text-charcoal/75 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
                  <p>
                    Moonstruck was founded in 2007 by two motor-design engineers
                    who were frustrated by the state of mass-market Indian
                    appliances &mdash; mixer grinders that died inside eighteen
                    months, fans that hummed at low voltage, irons whose thermostats
                    drifted after a single Mumbai monsoon. Their conviction was
                    simple: most of these failures were not design problems, they
                    were procurement problems. So they decided to build everything
                    themselves.
                  </p>
                  <p>
                    What started in a 4,000 square-foot leased shed in Pimpri is
                    today a 92,000 square-foot BIS-certified manufacturing facility
                    in Chakan, Pune, with in-house plastic moulding, copper winding,
                    PCB assembly, and a dedicated environmental-test lab. Every
                    Moonstruck product is validated against a 140V&ndash;280V supply
                    range, 95% relative humidity, and an IEC 60068 dust ingress
                    cycle &mdash; because those are the conditions Indian homes
                    actually run on, not the ones a European testing standard
                    assumes.
                  </p>
                  <p>
                    Eighteen years on, we are still privately held, still run by
                    engineers, and still building appliances we would put in our
                    own kitchens. We are not the biggest name in the category, and
                    we have never claimed to be. We just intend to be the one our
                    customers recommend to their parents.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 relative w-full h-[420px] md:h-[540px] animate-fade-in">
                <div className="absolute inset-0 bg-white rounded-3xl border border-primary/10 shadow-sm overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80"
                    alt="Precision appliance engineering on the factory floor"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-5 -right-5 bg-charcoal text-white rounded-2xl p-5 shadow-xl hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    Pune Facility
                  </p>
                  <p className="text-2xl font-black mt-1">92,000 sq ft</p>
                  <p className="text-[11px] text-white/60 font-semibold mt-1">
                    BIS &amp; ISO 9001 Certified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHAT WE STAND FOR */}
        <section className="py-20 md:py-28 bg-white border-y border-primary/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl mb-14 flex flex-col gap-3">
              <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> What We Stand For
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
                Four Things We Refuse To Compromise On.
              </h2>
              <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
                Every internal decision &mdash; from sourcing to support
                staffing &mdash; gets measured against these. If a shortcut would
                violate one of them, it does not ship.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="bg-cream/40 border border-primary/10 hover:border-primary/30 rounded-2xl p-6 md:p-7 flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="p-3 bg-primary/10 text-primary border border-primary/15 rounded-xl w-fit">
                    {v.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-charcoal tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed font-normal">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BY THE NUMBERS */}
        <section className="py-20 md:py-28 bg-cream/40 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div className="max-w-xl flex flex-col gap-3">
                <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> By The Numbers
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
                  Eighteen Years, Measured.
                </h2>
              </div>
              <p className="text-charcoal/70 text-sm md:text-base max-w-md leading-relaxed">
                We share the metrics we actually steer the business by &mdash; not
                the ones that look largest on a slide.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-primary/10 rounded-2xl p-6 md:p-8 flex flex-col gap-2 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <p className="text-4xl md:text-6xl font-black text-primary tracking-tight leading-none">
                    {s.value}
                  </p>
                  <p className="text-sm md:text-base font-black text-charcoal mt-3 tracking-tight">
                    {s.label}
                  </p>
                  <p className="text-[11px] md:text-xs text-charcoal/60 font-semibold uppercase tracking-wider">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. LEADERSHIP */}
        <section className="py-20 md:py-28 bg-white border-b border-primary/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl mb-14 flex flex-col gap-3">
              <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Leadership
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
                The People Who Sign Off On Every Product.
              </h2>
              <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
                Small leadership team by design. Every new SKU is reviewed and
                approved by the three of them before it enters tooling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {LEADERSHIP.map((m) => (
                <div
                  key={m.name}
                  className="bg-cream/30 border border-primary/10 rounded-2xl p-6 md:p-8 flex flex-col gap-5 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div
                    className={`w-20 h-20 rounded-2xl border flex items-center justify-center text-2xl font-black tracking-tight ${m.accent}`}
                    aria-hidden="true"
                  >
                    {m.initials}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl md:text-2xl font-black text-charcoal tracking-tight">
                      {m.name}
                    </h3>
                    <p className="text-xs md:text-sm font-black text-primary uppercase tracking-widest">
                      {m.role}
                    </p>
                  </div>
                  <p className="text-sm text-charcoal/70 leading-relaxed font-normal">
                    {m.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA BANNER */}
        <section className="py-20 md:py-28 bg-cream/40">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="relative overflow-hidden bg-charcoal text-white rounded-3xl border border-charcoal p-10 md:p-16 shadow-lg">
              <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold blur-3xl" />
              </div>

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <span className="text-gold text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Get In Touch
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] text-white">
                    Have a question?
                    <br />
                    Talk to our team.
                  </h2>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl">
                    Pre-sales question, service request, or a bulk enquiry for an
                    institutional buy &mdash; we will route you to a human inside
                    one business day.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <Link
                      href="/contact-us"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base px-7 py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      Talk To Our Team
                      <ArrowRight size={18} />
                    </Link>
                    <a
                      href="mailto:care@moonstruck.co.in"
                      className="inline-flex items-center gap-2 bg-white/5 border border-white/15 hover:border-white/40 hover:bg-white/10 text-white font-bold text-sm md:text-base px-7 py-4 rounded-xl transition-all"
                    >
                      Email Support
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="p-2.5 bg-primary/15 text-primary border border-primary/25 rounded-xl">
                      <MapPin size={20} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                        Head Office
                      </p>
                      <p className="text-sm md:text-base font-bold text-white leading-snug mt-1">
                        104, Industrial Area Phase II,
                        <br />
                        Mumbai, MH
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="p-2.5 bg-primary/15 text-primary border border-primary/25 rounded-xl">
                      <Phone size={20} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                        Toll Free
                      </p>
                      <a
                        href="tel:+9118002001122"
                        className="text-sm md:text-base font-bold text-white hover:text-gold transition-colors leading-snug mt-1"
                      >
                        +91 1800-200-1122
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="p-2.5 bg-primary/15 text-primary border border-primary/25 rounded-xl">
                      <Mail size={20} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                        Support Inbox
                      </p>
                      <a
                        href="mailto:care@moonstruck.co.in"
                        className="text-sm md:text-base font-bold text-white hover:text-gold transition-colors leading-snug mt-1"
                      >
                        care@moonstruck.co.in
                      </a>
                    </div>
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
    </div>
  );
}
