"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoBar from "@/components/PromoBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import CartDrawer from "@/components/CartDrawer";
import { Star, ShieldCheck, ShoppingCart, Plus, Minus, Share2, Mail, Truck, Zap, Percent, Play, ChevronDown, ChevronUp, CheckCircle2, Award } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';

const FAQ_ITEMS = [
  { q: "What is the warranty period?", a: "We offer a 2-year comprehensive warranty on the motor and a 1-year warranty on the product body." },
  { q: "Can it grind hard spices like turmeric?", a: "Yes, the heavy-duty 750W copper motor is designed to effortlessly grind hard spices like turmeric and coffee beans." },
  { q: "Are the jars dishwasher safe?", a: "The stainless steel jars are dishwasher safe, however, we recommend hand washing the lids to prolong the life of the rubber gaskets." },
  { q: "Does it have overload protection?", a: "Yes, it features an automatic overload protector that shuts off the motor to prevent overheating." }
];

const WATCH_REELS = [
  { id: 1, video: "https://assets.mixkit.co/videos/preview/mixkit-pouring-fresh-milk-into-a-glass-in-slow-motion-42610-large.mp4", title: "Perfect Smoothies" },
  { id: 2, video: "https://assets.mixkit.co/videos/preview/mixkit-cold-water-pouring-into-a-glass-42171-large.mp4", title: "Crushing Ice" },
  { id: 3, video: "https://assets.mixkit.co/videos/preview/mixkit-man-pouring-hot-water-into-a-teapot-42416-large.mp4", title: "Hot Soups" },
  { id: 4, video: "https://assets.mixkit.co/videos/preview/mixkit-man-hand-adjusting-thermostat-on-air-conditioner-42588-large.mp4", title: "Quiet Operation" }
];

// Helper to allow seamless switching between local public/ assets and Cloudinary URLs
const getMediaUrl = (src: string) => (src && typeof src === 'string') ? (src.startsWith('http') ? src : `${BASE_PATH}${src}`) : '';

const ImageWithFallback = ({ src, alt, className }: any) => {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <span className="text-xs font-bold">No Image</span>
      </div>
    );
  }
  return <img src={getMediaUrl(src)} alt={alt} className={className} onError={() => setError(true)} />;
};

export default function ProductDetailPage({ product: PRODUCT }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [qty, setQty] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    Wattage: "750W",
    Color: "Champagne Gold"
  });
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { addToCart } = useCart();
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the main add to cart button is out of view
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ display: 'block', backgroundPosition: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${PRODUCT.id}_${selectedVariants.Wattage}_${selectedVariants.Color}`,
      name: PRODUCT.name,
      price: PRODUCT.price,
      originalPrice: PRODUCT.mrp,
      image: PRODUCT.images[0],
      quantity: qty,
      variant: `${selectedVariants.Wattage} / ${selectedVariants.Color}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen select-none bg-cream/30 text-charcoal font-sans">
      <div className="sticky top-0 z-50 w-full">
        <PromoBar />
        {/* We use existing header, but we might want to force it dark if it isn't, but the prompt says 'Reuse my existing Header'. 
            It has its own background color in the component. That's perfectly fine. */}
        <Header />
      </div>

      <main className="flex-grow">
        {/* TOP SECTION: Gallery & Info */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-16">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal/50 mb-6">
            <a href={`${BASE_PATH}/`} className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href={`${BASE_PATH}/#kitchen-appliances`} className="hover:text-primary transition-colors">Kitchen Appliances</a>
            <span>/</span>
            <a href={`${BASE_PATH}/#mixer-grinders`} className="hover:text-primary transition-colors">Mixer Grinders</a>
            <span>/</span>
            <span className="text-charcoal font-bold">{PRODUCT.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div
                className="relative w-full aspect-square bg-cream/10 rounded-2xl border border-primary/10 overflow-hidden cursor-crosshair group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Sale Badge */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 uppercase rounded-full tracking-wider shadow-sm">
                    Save -{PRODUCT.discountPct}%
                  </span>
                </div>

                <ImageWithFallback
                  src={PRODUCT.images[activeImage]}
                  alt={`${PRODUCT.name} — view ${activeImage + 1}`}
                  className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                />

                {/* Zoom Overlay */}
                <div
                  className="absolute inset-0 bg-no-repeat pointer-events-none"
                  style={{
                    ...zoomStyle,
                    backgroundImage: `url(${getMediaUrl(PRODUCT.images[activeImage])})`,
                    backgroundSize: '200%',
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {PRODUCT.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white p-1 ${activeImage === idx ? 'border-gold shadow-[0_0_10px_rgba(201,168,106,0.3)] scale-105' : 'border-primary/10 hover:border-gold/50'}`}
                  >
                    <ImageWithFallback src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:col-span-5 flex flex-col gap-6 items-start">

              {/* Title & Rating Block */}
              <div className="flex flex-col gap-2 w-full">
                <h1 className="text-3xl md:text-5xl font-serif font-black text-charcoal leading-[1.15]">
                  {PRODUCT.name}
                </h1>

                <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mt-2 mb-2 w-full">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xl font-black text-charcoal">{PRODUCT.rating}</span>
                      <div className="flex items-center text-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} className={i < Math.floor(PRODUCT.rating) ? "fill-gold text-gold" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-charcoal/50 font-bold uppercase tracking-wider mt-1">
                      ({PRODUCT.reviewsCount} Reviews)
                    </span>
                  </div>
                  <div className="h-8 w-px bg-primary/10" />
                  <div className="flex flex-col">
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center">
                      <Zap size={10} className="mr-1 fill-primary" /> {PRODUCT.sold} Sold
                    </span>
                  </div>
                </div>

                <p className="text-charcoal/70 text-sm md:text-base leading-relaxed mt-2">
                  {PRODUCT.description}
                </p>
              </div>

              {/* Key Features Bullets */}
              <div className="flex flex-col gap-2 w-full">
                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Product Features</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {PRODUCT.features.map((feat, idx) => (
                    <li key={idx} className="text-xs md:text-sm text-charcoal/80 flex items-start gap-2">
                      <span className="text-primary text-sm">•</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Block */}
              <div className="flex flex-col bg-cream/50 border border-primary/10 rounded-2xl p-5 gap-4 w-full mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-primary/70 font-extrabold uppercase tracking-widest">
                      Special Deal Price
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black text-charcoal">₹{PRODUCT.price.toLocaleString()}</span>
                      <span className="text-sm text-charcoal/40 line-through">₹{PRODUCT.mrp.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] text-green-700 font-extrabold bg-green-100/60 px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck size={12} className="inline text-green-700" /> Save ₹{PRODUCT.savings.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-primary font-bold mt-1.5 tracking-wider uppercase">
                      Earn +{PRODUCT.coins} Coins
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Only {PRODUCT.stock} units left in stock!</span>
                </div>
              </div>

              {/* Variant Selectors */}
              {PRODUCT.variants.map((variantGroup: any) => (
                <div key={variantGroup.type} className="flex flex-col gap-2 mt-2 w-full">
                  <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
                    Select {variantGroup.type}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variantGroup.options.map((opt: any) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [variantGroup.type]: opt }))}
                        className={`text-xs font-bold px-4 py-2 border rounded-full transition-all cursor-pointer ${selectedVariants[variantGroup.type] === opt
                            ? "bg-charcoal text-white border-charcoal shadow-sm scale-105"
                            : "bg-white text-charcoal/70 border-gray-200 hover:border-primary/40"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity & CTA */}
              <div className="flex flex-col gap-4 mt-2 w-full" ref={observerRef}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-3 text-charcoal/70 hover:text-primary transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-charcoal">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="p-3 text-charcoal/70 hover:text-primary transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow bg-white hover:bg-cream/50 border border-gray-200 text-charcoal font-bold py-3.5 rounded-xl transition-all hover:border-primary/40 shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Buy It Now — Limited Time Deal
                </button>
              </div>

              {/* Delivery & UPI Offers */}
              <div className="flex flex-col gap-3 mt-2 w-full">
                <div className="flex items-center gap-3 bg-white border border-primary/10 p-3 rounded-xl text-xs text-charcoal/80 shadow-sm">
                  <Truck size={18} className="text-primary" />
                  <span>Delivery within 2 business days · <span className="font-bold text-primary">Free across India</span></span>
                </div>

                <div className="flex items-center justify-between bg-green-50/50 border border-green-200 p-3 rounded-xl text-xs shadow-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <Percent size={16} />
                    <span className="font-bold">Extra 5% off on UPI</span>
                  </div>
                  <div className="flex gap-1">
                    <img src="https://img.icons8.com/color/48/000000/google-pay-india.png" className="w-5 h-5 object-contain" alt="GPay" />
                    <img src="https://img.icons8.com/color/48/000000/phone-pe.png" className="w-5 h-5 object-contain" alt="PhonePe" />
                  </div>
                </div>
              </div>

              {/* Coupons Row */}
              <div className="grid grid-cols-2 gap-3 mt-2 w-full">
                <div className="bg-white border border-primary/10 shadow-sm p-3 rounded-xl flex flex-col gap-1 hover:border-primary/40 transition-colors cursor-pointer group">
                  <span className="text-[10px] text-primary/70 uppercase tracking-widest font-extrabold">Buy 1</span>
                  <span className="text-sm font-black text-charcoal">Get 5% OFF</span>
                  <div className="text-[9px] font-mono bg-cream/50 border border-primary/10 px-2 py-0.5 rounded w-fit text-charcoal/70 group-hover:text-primary mt-1 font-bold">Code: SINGLE5</div>
                </div>
                <div className="bg-white border border-primary/10 shadow-sm p-3 rounded-xl flex flex-col gap-1 hover:border-primary/40 transition-colors cursor-pointer group">
                  <span className="text-[10px] text-primary/70 uppercase tracking-widest font-extrabold">Buy 2</span>
                  <span className="text-sm font-black text-charcoal">Get 10% OFF</span>
                  <div className="text-[9px] font-mono bg-cream/50 border border-primary/10 px-2 py-0.5 rounded w-fit text-charcoal/70 group-hover:text-primary mt-1 font-bold">Code: DUO10</div>
                </div>
              </div>

              {/* Trust Mini Row */}
              <div className="flex items-center justify-between border-y border-gray-200 py-4 mt-2 px-2 w-full">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/60 font-bold">Easy Returns</span>
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <div className="flex flex-col items-center gap-1">
                  <Truck size={20} className="text-primary" />
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/60 font-bold">Fast Delivery</span>
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <div className="flex flex-col items-center gap-1">
                  <CheckCircle2 size={20} className="text-primary" />
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/60 font-bold">COD Available</span>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4 mt-2 w-full">
                <span className="text-xs text-charcoal/50 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Share2 size={14} /> Share
                </span>
                <div className="flex gap-2">
                  <button className="p-2 bg-white border border-gray-200 shadow-sm rounded-full hover:bg-primary hover:border-primary hover:text-white text-charcoal transition-colors"><Mail size={14} /></button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Ticker Strip */}
        <div className="w-full bg-gold py-3 overflow-hidden border-y border-gold/50 flex">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-charcoal font-black text-xs md:text-sm uppercase tracking-widest">
            <span>ISI Certified</span>
            <span>•</span>
            <span>2-Year Warranty</span>
            <span>•</span>
            <span>Free Shipping</span>
            <span>•</span>
            <span>Made in India</span>
            <span>•</span>
            <span>Premium Built</span>
            <span>•</span>
            <span>ISI Certified</span>
            <span>•</span>
            <span>2-Year Warranty</span>
            <span>•</span>
            <span>Free Shipping</span>
            <span>•</span>
            <span>Made in India</span>
            <span>•</span>
            <span>Premium Built</span>
          </div>
        </div>

        {/* Feature Cards Grid Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
          <div className="text-center mb-12 flex flex-col items-center gap-2">
            <span className="text-primary text-xs font-black tracking-widest uppercase">Unmatched Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">Engineered for Excellence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Heavy-Duty Motor", desc: "100% copper wound motor for sustained performance." },
              { num: "02", title: "4 Versatile Jars", desc: "Includes wet, dry, chutney, and juicer jars for all needs." },
              { num: "03", title: "Stainless Blades", desc: "Razor-sharp 304 grade steel blades cut through tough spices." },
              { num: "04", title: "Easy Clean Surface", desc: "Seamless body design prevents residue buildup." },
              { num: "05", title: "Overload Protection", desc: "Smart shut-off mechanism prevents motor burnout." },
              { num: "06", title: "3 Speed Levels", desc: "Precise control from gentle blending to fierce grinding." }
            ].map((card, i) => (
              <div key={i} className="bg-white border border-primary/10 shadow-sm p-6 rounded-2xl flex flex-col gap-3 hover:border-primary/30 transition-colors group">
                <span className="text-gold font-serif text-2xl italic">{card.num}</span>
                <h3 className="text-lg font-bold text-charcoal group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Long Form Story Section */}
        <section className="border-y border-primary/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-primary text-xs font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" /> The Moonstruck Difference
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-charcoal leading-[1.15]">
                Crafted with Celestial Precision.
              </h2>
              <div className="space-y-4 text-charcoal/70 text-sm md:text-base leading-relaxed">
                <p>
                  At Moonstruck, engineering is an obsession. We don't believe in quick-turnaround electronics that end up in landfills. Every single mixer grinder is born from continuous R&D and meticulous structural testing.
                </p>
                <p>
                  Every home appliance goes through 12 stages of rigorous validation. We make sure each component can comfortably withstand voltage fluctuations, peak utility usage, and the dynamic everyday routines of the modern Indian home.
                </p>
              </div>
            </div>
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-primary/10 p-2 bg-cream/30">
              <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover rounded-xl grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Precision Engineering" />
            </div>
          </div>
        </section>

        {/* Watch & Buy Reels */}
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 flex flex-col items-center gap-2">
            <span className="text-primary text-xs font-black tracking-widest uppercase">See It In Action</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">Watch & Buy</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {WATCH_REELS.map((reel) => (
              <div key={reel.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-primary/10 group cursor-pointer bg-black shadow-sm">
                <video src={getMediaUrl(reel.video)} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent">
                  <div className="self-end bg-white/20 backdrop-blur p-2 rounded-full text-white">
                    <Play size={16} className="fill-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-white">{reel.title}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleAddToCart(); }} className="w-full bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase py-2 rounded shadow-md transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Trust Us Badges */}
        <section className="border-t border-primary/10 py-16 bg-cream/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {[
                { icon: <ShieldCheck size={24} />, text: "ISI Certified" },
                { icon: <Star size={24} />, text: "1M+ Customers" },
                { icon: <Award size={24} />, text: "ISO 9001:2015" },
                { icon: <Truck size={24} />, text: "Direct Supply" },
                { icon: <Zap size={24} />, text: "Fast Support" },
                { icon: <CheckCircle2 size={24} />, text: "Made in India" }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-primary/20 flex items-center justify-center bg-white text-primary shadow-sm">
                    {badge.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-charcoal/70 text-center w-24">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase Strip */}
        <section className="flex w-full h-[200px] md:h-[350px] bg-white">
          {PRODUCT.images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="flex-1 h-full border-r border-primary/10 last:border-0 relative group overflow-hidden bg-cream/10">
              <ImageWithFallback src={img} alt="Showcase" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
            </div>
          ))}
        </section>

        {/* FAQ Accordion */}
        <section className="py-20 max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 flex flex-col items-center gap-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">Frequently Asked Questions</h2>
          </div>
          <div className="flex flex-col gap-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div key={idx} className="border border-primary/10 rounded-xl bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/20 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm md:text-base text-charcoal">{faq.q}</span>
                  {faqOpen === idx ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-charcoal/40" />}
                </button>
                {faqOpen === idx && (
                  <div className="p-5 pt-0 text-charcoal/60 text-sm leading-relaxed border-t border-gray-100 mt-2 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* You May Also Like */}
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-6 border-t border-primary/10">
          <h2 className="text-2xl font-serif font-bold mb-8 text-charcoal">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white border border-primary/10 rounded-2xl p-4 flex flex-col gap-3 group hover:border-primary/40 transition-colors shadow-sm">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-cream/10">
                  <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider shadow-sm uppercase">Save ₹500</span>
                  <ImageWithFallback src={PRODUCT.images[item]} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="Related" />
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center text-gold mb-1">
                    <Star size={12} className="fill-gold" /><Star size={12} className="fill-gold" /><Star size={12} className="fill-gold" /><Star size={12} className="fill-gold" /><Star size={12} className="fill-gold" />
                  </div>
                  <h4 className="text-sm font-bold text-charcoal group-hover:text-primary transition-colors">AeroCool Extra {item}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-charcoal">₹2,499</span>
                    <span className="text-xs text-charcoal/40 line-through">₹2,999</span>
                  </div>
                  <span className="text-[9px] text-primary/70 font-bold uppercase tracking-wider mt-1">Earn +50 Coins</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Mobile Sticky Buy Bar */}
      <div className={`md:hidden fixed bottom-14 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-40 transition-transform duration-300 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)] ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex flex-col">
          <span className="text-[10px] text-primary/70 uppercase tracking-widest font-extrabold">Limited Deal</span>
          <span className="text-lg font-black text-charcoal">₹{PRODUCT.price.toLocaleString()}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-primary text-white font-black uppercase text-xs px-6 py-3 rounded-xl shadow-md"
        >
          Buy Now
        </button>
      </div>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
