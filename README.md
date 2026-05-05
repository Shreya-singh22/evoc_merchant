# Moonstruck Home Appliances E-Commerce

A stunning, high-performance, story-driven Next.js & Tailwind CSS e-commerce website designed for the premium home appliances vertical.

## Tech Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: CSS animations & infinite marquee fallback

## Project Structure
- `src/app/page.tsx`: Core landing page loading and sorting all page sections.
- `src/components/`: Modular component blocks for clean and extensible customization.
- `src/context/CartContext.tsx`: Client-side state handling the slide-in cart drawer.

## Customization & Management

### 1. Swapping Hero Slides
To update or add new slides in the Hero section, navigate to `src/components/Hero.tsx` and modify the `SLIDES` array:
```typescript
const SLIDES = [
  {
    id: 1,
    title: "Beat the Heat with Smart Cooling",
    subtitle: "Summer Collection",
    description: "Stay perfectly chilled. Explore our energy-saving coolers and high-speed fans.",
    tag: "UP TO 50% OFF",
    bg: "bg-gradient-to-tr from-[#f6ede2] via-[#F8F1E7] to-[#ffe5cf]",
    cta: "Explore Coolers",
    link: "#coolers",
  },
  // ... Add or remove slides here
];
```

### 2. Editing the Marquee Text
To change text in the infinite scrolling value or certifications marquee, edit the `VALUES` array inside `src/components/ValueMarquee.tsx` or `src/components/Certifications.tsx`.
```typescript
const VALUES = [
  "🛡️ ISI CERTIFIED",
  "✅ 2-YEAR WARRANTY",
  "📞 24/7 SUPPORT",
  "🇮🇳 MADE IN INDIA",
  "🔧 FREE INSTALLATION",
  "📦 FAST DELIVERY",
];
```

### 3. Managing Product Grid Collections & Tabs
To configure and structure product listings in the Discover section, update the `INITIAL_PRODUCTS` array inside `src/components/Discover.tsx`:
```typescript
const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    tab: "Best Sellers", // Best Sellers | Value Combos | New Arrivals
    name: "Ultra-Grind 750W Mixer Grinder",
    description: "Multi-purpose mixer grinder for high efficiency...",
    price: 3499,
    mrp: 4999,
    savings: 1500,
    rating: 4.8,
    reviews: 142,
    variants: ["750W", "1000W"],
    badge: "Best Seller",
    coins: 100,
    image1: "...",
    image2: "...",
  },
  // ... Add more items
];
```

### 4. Customizing the Whatmore Live Reels Section
To manage shoppable reels, edit the `REELS_DATA` array inside `src/components/Reels.tsx`:
```typescript
const REELS_DATA = [
  {
    id: "reel-1",
    title: "Grinding wet masala to fine perfection",
    sub: "Indian Spices Demo",
    video: "...",
    product: {
      id: "prod_1",
      name: "Ultra-Grind 750W Mixer Grinder",
      price: 3499,
      image: "...",
    },
  },
];
```

---
## Developing Locally
1. Run `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000) to preview.
