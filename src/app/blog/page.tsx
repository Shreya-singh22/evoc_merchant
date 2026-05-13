"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Tag,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";

import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

type BlogCategory =
  | "Maintenance"
  | "Buying Guides"
  | "Energy Saving"
  | "Monsoon Care"
  | "Kitchen Science"
  | "Warranty & Service";

type Filter = "All" | BlogCategory;

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: BlogCategory;
  author: string;
  authorRole: string;
  dateISO: string;
  readMinutes: number;
  featured?: boolean;
}

const FILTERS: Filter[] = [
  "All",
  "Maintenance",
  "Buying Guides",
  "Energy Saving",
  "Monsoon Care",
  "Kitchen Science",
  "Warranty & Service",
];

const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "mixer-grinder-motor-burn-out-signs",
    title:
      "Six Sounds Your Mixer Grinder Makes Before The Motor Burns Out",
    excerpt:
      "A blocked vent, a slipping coupler, or a stuck blade can each push a 750W motor into thermal shutdown within minutes. Learn the early warning sounds we listen for in service and how to act before the windings cook.",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80",
    category: "Maintenance",
    author: "Anjali Krishnan",
    authorRole: "Senior Product Engineer",
    dateISO: "2026-05-08",
    readMinutes: 7,
    featured: true,
  },
  {
    id: 2,
    slug: "5-star-vs-3-star-ac-real-bill-difference",
    title:
      "5-Star vs 3-Star AC: What Your Electricity Bill Actually Looks Like After A Mumbai Summer",
    excerpt:
      "We ran a 1.5-ton inverter AC at 26 degrees in two Mumbai flats for 90 days. The bill difference between a 3-star and 5-star unit was not what most buyers expect, and the payback period surprised us.",
    image:
      "https://images.unsplash.com/photo-1631545308456-69e51702fb9b?auto=format&fit=crop&w=1600&q=80",
    category: "Energy Saving",
    author: "Rohan Verma",
    authorRole: "Thermal Systems Lead",
    dateISO: "2026-05-03",
    readMinutes: 9,
  },
  {
    id: 3,
    slug: "buying-guide-chimney-cfm-indian-kitchens",
    title:
      "How To Pick The Right Chimney CFM For An Indian Kitchen That Actually Tadkas",
    excerpt:
      "Marketing pages quote 1200 m3/hr like it is a magic number. For a kitchen that does daily tadka, dosa, and deep frying, suction is only half the story. Here is how to size your chimney for real Indian cooking loads.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    category: "Buying Guides",
    author: "Sneha Iyer",
    authorRole: "Kitchen Appliance Specialist",
    dateISO: "2026-04-27",
    readMinutes: 8,
  },
  {
    id: 4,
    slug: "monsoon-washing-machine-drying-hacks",
    title:
      "Monsoon Laundry: Getting Clothes Truly Dry Without A Heat Pump Dryer",
    excerpt:
      "Front-load spin cycles, drum balance, and a clever final rinse temperature can pull an extra 12 to 18 percent of moisture out of every load. Tested across four Mumbai monsoons and three machine generations.",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1600&q=80",
    category: "Monsoon Care",
    author: "Anjali Krishnan",
    authorRole: "Senior Product Engineer",
    dateISO: "2026-04-22",
    readMinutes: 6,
  },
  {
    id: 5,
    slug: "induction-vs-gas-real-thermal-efficiency",
    title:
      "Why Your Dal Cooks Faster On Induction: The Real Thermal Efficiency Numbers",
    excerpt:
      "Induction hits about 84 percent thermal efficiency. An LPG burner peaks around 40 percent. We measured both with a 2-litre stainless steel pot of arhar dal, and the time and gas-bill math is genuinely brutal.",
    image:
      "https://images.unsplash.com/photo-1556909114-44e3e9399a2f?auto=format&fit=crop&w=1600&q=80",
    category: "Kitchen Science",
    author: "Kabir Singh",
    authorRole: "R&D Engineer",
    dateISO: "2026-04-18",
    readMinutes: 5,
  },
  {
    id: 6,
    slug: "extended-warranty-when-it-actually-pays",
    title:
      "Extended Warranty: When It Genuinely Pays And When It Is Pure Margin",
    excerpt:
      "Compressor failure rates on inverter ACs in years 3 to 5, PCB failure on washing machines, and motor replacement costs on chimneys. Cold numbers from our service ledger to help you decide what to actually buy.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=80",
    category: "Warranty & Service",
    author: "Priya Nair",
    authorRole: "Head of After-Sales",
    dateISO: "2026-04-12",
    readMinutes: 7,
  },
  {
    id: 7,
    slug: "refrigerator-gasket-care-monsoon",
    title:
      "The Rubber Gasket On Your Fridge Is Doing 30 Percent Of The Cooling Work",
    excerpt:
      "A tired door seal silently adds 18 to 25 units of electricity a month and makes the compressor cycle non-stop. Here is the five-minute paper-strip test we teach every service engineer.",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1600&q=80",
    category: "Maintenance",
    author: "Rohan Verma",
    authorRole: "Thermal Systems Lead",
    dateISO: "2026-04-06",
    readMinutes: 4,
  },
  {
    id: 8,
    slug: "water-purifier-tds-myth",
    title:
      "The TDS Myth: Why Lower Is Not Always Better For Your Drinking Water",
    excerpt:
      "RO purifiers strip TDS down to 30 ppm and below. For most Indian municipal supplies, that is overcorrection. We break down the BIS guidance, the taste impact, and when a UV+UF setup is the smarter buy.",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1600&q=80",
    category: "Buying Guides",
    author: "Sneha Iyer",
    authorRole: "Kitchen Appliance Specialist",
    dateISO: "2026-03-30",
    readMinutes: 8,
  },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState("");

  const featured = useMemo(
    () => ARTICLES.find((a) => a.featured) ?? ARTICLES[0],
    []
  );

  const gridArticles = useMemo(() => {
    const pool = ARTICLES.filter((a) => a.id !== featured.id);
    if (filter === "All") return pool;
    return pool.filter((a) => a.category === filter);
  }, [filter, featured.id]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subEmail.trim() === "") return;
    setSubscribed(true);
    setSubEmail("");
  };

  return (
    <div className="flex flex-col min-h-screen select-none bg-cream text-charcoal pb-14 sm:pb-0">
      <div className="sticky top-0 z-40 w-full select-none">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow">
        {/* 1. Hero band */}
        <section className="relative bg-cream/40 border-b border-primary/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#C8102E_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.04]" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 flex flex-col items-start gap-4 animate-fade-in">
            <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Expert Blog
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.05] max-w-3xl">
              Engineering Notes For Your Home
            </h1>
            <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-2xl">
              Honest, field-tested guidance from the Moonstruck product and service teams.
              Maintenance, monsoon care, kitchen science, energy-saving math, and the buying
              decisions we would make for our own families.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] md:text-xs text-charcoal/60 font-bold tracking-wide uppercase">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-primary" /> {ARTICLES.length} Articles
              </span>
              <span className="text-charcoal/30">/</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-forest" /> Written by certified engineers
              </span>
              <span className="text-charcoal/30">/</span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-gold" /> Updated weekly
              </span>
            </div>
          </div>
        </section>

        {/* 2. Category pill bar (sticky-ish) */}
        <div className="sticky top-[88px] md:top-[96px] z-30 bg-cream/95 backdrop-blur-md border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 text-xs md:text-sm font-black tracking-wide px-4 md:px-5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  filter === f
                    ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                    : "bg-white text-charcoal/70 border-primary/10 hover:text-primary hover:border-primary/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Featured article */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none">
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Editor&apos;s Pick
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
              This Week On The Bench
            </h2>
          </div>

          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className="relative w-full h-64 md:h-80 lg:h-full overflow-hidden bg-cream/40">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1.5 uppercase rounded-full shadow-md tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} /> Featured
              </span>
              <span className="absolute top-4 right-4 bg-white/95 backdrop-blur text-charcoal text-[10px] font-black px-3 py-1.5 uppercase rounded-full shadow-sm tracking-widest flex items-center gap-1.5">
                <Tag size={11} className="text-primary" /> {featured.category}
              </span>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center gap-5 bg-white">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-primary/70 uppercase">
                <span>{formatDate(featured.dateISO)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {featured.readMinutes} min read
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-charcoal leading-[1.15] group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              <p className="text-sm md:text-base text-charcoal/70 leading-relaxed line-clamp-2">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-charcoal leading-tight">
                    {featured.author}
                  </span>
                  <span className="text-[11px] text-charcoal/60 font-semibold tracking-wide uppercase">
                    {featured.authorRole}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-black text-primary tracking-wide uppercase mt-2">
                Read The Full Breakdown
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </Link>
        </section>

        {/* 4. Articles grid */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none bg-white rounded-none">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl flex flex-col gap-2">
              <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> The Library
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
                {filter === "All" ? "Every Article" : filter}
              </h2>
              <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
                {filter === "All"
                  ? "Browse every guide our engineers and service heads have published."
                  : `Filtered to ${filter.toLowerCase()}. Switch categories above to explore more.`}
              </p>
            </div>
            <span className="text-xs md:text-sm font-black text-charcoal/50 tracking-widest uppercase">
              {gridArticles.length} {gridArticles.length === 1 ? "Article" : "Articles"}
            </span>
          </div>

          {gridArticles.length === 0 ? (
            <div className="py-20 text-center text-charcoal/60 text-sm font-semibold border border-dashed border-primary/20 rounded-2xl bg-cream/30">
              No articles in {filter.toLowerCase()} yet. Check back next week.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 animate-fade-in">
              {gridArticles.map((a) => (
                <article
                  key={a.id}
                  className="flex flex-col bg-cream/20 border border-primary/10 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                >
                  <Link
                    href={`/blog/${a.slug}`}
                    className="relative w-full h-52 md:h-56 overflow-hidden block bg-cream/40"
                  >
                    <img
                      src={a.image}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-charcoal text-[10px] font-black px-2.5 py-1.5 uppercase rounded-full shadow-sm tracking-widest flex items-center gap-1.5">
                      <Tag size={10} className="text-primary" /> {a.category}
                    </span>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow bg-white border-t border-gray-50">
                    <div className="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-widest text-primary/70 uppercase">
                      <span>{formatDate(a.dateISO)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {a.readMinutes} min
                      </span>
                    </div>

                    <Link href={`/blog/${a.slug}`} className="block">
                      <h3 className="text-lg md:text-xl font-black text-charcoal leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                    </Link>

                    <p className="text-xs md:text-sm text-charcoal/70 leading-relaxed mb-5 line-clamp-2 flex-grow">
                      {a.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t border-primary/10 pt-4 mt-auto">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-charcoal leading-tight">
                            {a.author}
                          </span>
                          <span className="text-[10px] text-charcoal/55 font-semibold tracking-wide uppercase leading-tight">
                            {a.authorRole}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${a.slug}`}
                        className="text-[11px] font-black text-primary hover:text-primary/80 tracking-widest uppercase flex items-center gap-1 group/link"
                      >
                        Read
                        <ChevronRight
                          size={13}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 5. Newsletter / subscribe to weekly notes */}
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-6 select-none">
          <div className="bg-charcoal text-white border border-charcoal rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#C9A86A_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-[0.07]" />

            <div className="flex-1 flex flex-col gap-3 relative z-10">
              <span className="bg-gold/15 text-gold border border-gold/30 text-[10px] md:text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                <BookOpen size={12} /> Weekly Notes
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-[1.15]">
                One useful appliance insight, every Friday.
              </h2>
              <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-xl">
                Field notes, service-bench observations, and the questions our customers
                ask most. No discount spam, no clickbait. Unsubscribe anytime.
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-[380px] relative z-10">
              {!subscribed ? (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="you@home.in"
                    className="flex-grow bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-sm font-semibold px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold/60 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white font-black text-xs md:text-sm uppercase tracking-widest px-6 py-3.5 rounded-xl cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <div className="bg-forest/20 border border-forest/40 text-white text-sm font-bold px-5 py-4 rounded-xl flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-gold" />
                  You&apos;re in. First note lands this Friday.
                </div>
              )}
              <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase mt-3">
                Joining 12,400+ Moonstruck readers
              </p>
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
