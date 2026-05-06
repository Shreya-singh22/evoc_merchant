# Moonstruck Appliances — Product Listing Page (PLP)

This is a production-grade, URL-driven Product Listing Page (PLP) designed and implemented for the **Moonstruck Appliances** e-commerce store. 

## Features
- **URL-Driven State Handling:** All filters, sort selections, and custom price ranges are fully synchronized with the browser's URL query parameters, so selections survive page reloads and are instantly shareable.
- **12 Premium Product Catalog:** Sourced directly from your 2 core SKUs (`Kuro 700W` & `MegaMixer 1000W`) and expanded with 10 plausible premium items written in the brand's exact voice.
- **Interactive Component State:** Card hover events (image transitions, Quick-Add), responsive local Storage wishlist (heart toggle), and seamless integration with your global `CartContext` and `CartDrawer` so items are added instantly.
- **Full Responsive Adaptation:** Designed mobile-first with responsive grid breakpoints and a dedicated swipe-up Bottom Sheet drawer for mobile filter & sorting controls.
- **A11y & Performance Compliant:** Clean semantic HTML structures (`<nav>`, `<main>`, `<aside>`, `<article>`), explicit image layout dimensions to eliminate Cumulative Layout Shift (CLS), and keyboard-navigable filters.

## Design Rationale & Palette
To mirror Moonstruck's "Celestial Craftsmanship" identity, we steered clear of default e-commerce frameworks and selected a luxurious **warm off-white background (`#F8F1E7`)** paired with **striking premium charcoal typography (`#1A1A1A`)** and **celestial gold accents (`#C9A86A`)**. Headings utilize the distinct display serif **Fraunces** for an artisanal, editorial aesthetic, while the body and filters are rendered in the modern, highly legible **Inter sans-serif** font to maintain crisp legibility across all screen sizes.

## Local Setup & Run
1. Go to the project root directory.
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Navigate to `/products` in your browser to view the live PLP:
   - [http://localhost:3000/products](http://localhost:3000/products) (or [http://localhost:3001/products](http://localhost:3001/products))
