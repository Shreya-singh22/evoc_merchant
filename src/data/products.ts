export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  price: number;
  compareAt: number;
  currency: string;
  discountPct: number;
  inStock: boolean;
  tags: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  dateAdded: string;
  features: string[];
  sold: string;
  description: string;
  name: string;
  mrp: number;
  savings: number;
  coins: number;
  stock: number;
  variants: any[];
}

export const PRODUCTS_CATALOG: any[] = [
  // @ts-ignore - Ignoring legacy static mock data types as runtime data is now dynamic via API

  {
    id: "kuro-700w",
    slug: "moonstruck-kuro-2-jar-set-700-w-juicer-mixer-grinder",
    title: "Moonstruck Kuro 700W Mixer Grinder",
    subtitle: "2 Jars · HeatShield Motor · LiveView Chutney Jar · ISI Certified · 2-Yr Warranty",
    color: "Gray",
    price: 1399,
    compareAt: 2799,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Kitchen", "Mixer Grinder", "Best Seller"],
    images: [
      "https://moonstruck.co.in/cdn/shop/files/kuro-front.png",
      "https://moonstruck.co.in/cdn/shop/files/kuro-side.png"
    ],
    rating: 4.7,
    reviewsCount: 88,
    dateAdded: "2025-10-01"
  },
  {
    id: "megamixer-1000w",
    slug: "moonstruck-1000-watt-mixer-grinder-with-4-jars-copy",
    title: "Moonstruck MegaMixer 1000W Juicer Mixer Grinder",
    subtitle: "4 Jars · StealthDrive Motor · 1.5L Juicer with Seed Extractor · LiveView Chutney Jar FREE · ISI Certified",
    color: "Black",
    price: 3499,
    compareAt: 6999,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Kitchen", "Juicer Mixer Grinder", "New"],
    images: [
      "https://moonstruck.co.in/cdn/shop/files/megamixer-front.png",
      "https://moonstruck.co.in/cdn/shop/files/megamixer-jars.png"
    ],
    rating: 4.9,
    reviewsCount: 124,
    dateAdded: "2026-03-15"
  },
  {
    id: "kettl-1500w",
    slug: "moonstruck-aurum-1-5l-electric-kettle",
    title: "Moonstruck Aurum 1.5L Electric Kettle",
    subtitle: "1500W · Double-Wall Cool Touch · Strix Thermostat · Auto Shut-off · 2-Yr Warranty",
    color: "Champagne Gold",
    price: 1899,
    compareAt: 3799,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Kitchen", "Electric Kettle", "Best Seller"],
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1594385208974-2e75f9d3ab48?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.6,
    reviewsCount: 72,
    dateAdded: "2025-11-20"
  },
  {
    id: "toaster-850w",
    slug: "moonstruck-solis-2-slice-toaster",
    title: "Moonstruck Solis 2-Slice Toaster",
    subtitle: "850W · Extra-Wide Slots · 7 Browning Levels · Removable Crumb Tray · 2-Yr Warranty",
    color: "Moon-White",
    price: 2199,
    compareAt: 4399,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Kitchen", "Toaster"],
    images: [
      "https://images.unsplash.com/photo-1583241475879-da372d62efef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583241475518-e3663a8e9471?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    reviewsCount: 45,
    dateAdded: "2025-12-05"
  },
  {
    id: "iron-1200w",
    slug: "moonstruck-glide-1200w-steam-iron",
    title: "Moonstruck Glide 1200W Steam Iron",
    subtitle: "1200W · Teflon Soleplate · Continuous Steam · Anti-Drip & Anti-Calc · 2-Yr Warranty",
    color: "Indigo Blue",
    price: 1599,
    compareAt: 3199,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Home Appliances", "Steam Iron", "New"],
    images: [
      "https://images.unsplash.com/photo-1517256011251-8e0309320e8b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517256011406-896bf54fc487?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.4,
    reviewsCount: 51,
    dateAdded: "2026-02-10"
  },
  {
    id: "heater-2000w",
    slug: "moonstruck-boreas-2000w-ptc-room-heater",
    title: "Moonstruck Boreas 2000W PTC Room Heater",
    subtitle: "2000W · Ceramic Heating Element · Wide-Angle Oscillation · Overheat Protection · 2-Yr Warranty",
    color: "Charcoal Black",
    price: 4499,
    compareAt: 8999,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Home Appliances", "Winter Appliances", "New"],
    images: [
      "https://images.unsplash.com/photo-1522003885544-77bbfa7be199?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522003885348-77bbfa7be200?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.8,
    reviewsCount: 63,
    dateAdded: "2026-04-01"
  },
  {
    id: "fan-pedestal",
    slug: "moonstruck-zephyr-pedestal-fan",
    title: "Moonstruck Zephyr Pedestal Fan",
    subtitle: "High-Speed Copper Motor · SilentDrive Blades · Remote Control · 3 Speed Modes · 2-Yr Warranty",
    color: "Moon-White",
    price: 3299,
    compareAt: 6599,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Home Appliances", "Summer Appliances", "Best Seller"],
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db875?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    reviewsCount: 94,
    dateAdded: "2025-08-15"
  },
  {
    id: "aircooler-45l",
    slug: "moonstruck-aeroblast-45l-personal-air-cooler",
    title: "Moonstruck AeroBlast 45L Personal Air Cooler",
    subtitle: "45 Liters · High-Density Honeycomb Pads · Ice Chamber · 3-Speed Blow · 2-Yr Warranty",
    color: "Midnight Black",
    price: 6999,
    compareAt: 13999,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Home Appliances", "Summer Appliances"],
    images: [
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f903?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    reviewsCount: 38,
    dateAdded: "2025-09-10"
  },
  {
    id: "juicer-slow",
    slug: "moonstruck-nectar-slow-juicer-200w",
    title: "Moonstruck Nectar Slow Juicer 200W",
    subtitle: "200W Cold Press · Cold Extraction Technology · Large Feed Chute · Reverse Function · 5-Yr Motor Warranty",
    color: "Champagne Gold",
    price: 8499,
    compareAt: 16999,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Kitchen", "Best Seller"],
    images: [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.8,
    reviewsCount: 109,
    dateAdded: "2025-07-01"
  },
  {
    id: "induction-2000w",
    slug: "moonstruck-ignis-2000w-induction-cooktop",
    title: "Moonstruck Ignis 2000W Induction Cooktop",
    subtitle: "2000W · Microcrystalline Glass Panel · 8 Preset Menus · Auto Pan Detection · 2-Yr Warranty",
    color: "Obsidian Black",
    price: 2999,
    compareAt: 5999,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Kitchen"],
    images: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.6,
    reviewsCount: 57,
    dateAdded: "2026-01-20"
  },
  {
    id: "hand-blender",
    slug: "moonstruck-turboblend-400w-hand-blender",
    title: "Moonstruck TurboBlend 400W Hand Blender",
    subtitle: "400W Silent DC Motor · Dual-Speed Control · Stainless Steel Whisk & Beaker · 2-Yr Warranty",
    color: "Slate Gray",
    price: 1799,
    compareAt: 3599,
    currency: "INR",
    discountPct: 50,
    inStock: false,
    tags: ["Kitchen", "New"],
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.3,
    reviewsCount: 22,
    dateAdded: "2026-04-10"
  },
  {
    id: "garment-steamer",
    slug: "moonstruck-steamaura-garment-steamer",
    title: "Moonstruck SteamAura Garment Steamer",
    subtitle: "1600W · 1.5L Detachable Tank · Continuous Steam Output · Adjustable Pole with Hanger · 2-Yr Warranty",
    color: "Deep Indigo",
    price: 4999,
    compareAt: 9999,
    currency: "INR",
    discountPct: 50,
    inStock: true,
    tags: ["Home Appliances", "New"],
    images: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    reviewsCount: 41,
    dateAdded: "2026-03-28"
  }
];
