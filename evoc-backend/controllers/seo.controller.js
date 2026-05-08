// evoc-backend/controllers/seo.controller.js
//
// WHY THIS FILE EXISTS:
// Day 2 Morning task: GET /api/products/:slug/meta
//
// This endpoint is specifically designed for Next.js generateMetadata().
// When the storefront's Product Detail Page (PDP) loads, Next.js calls this
// endpoint to build the <head> of the page — the <title>, meta description,
// Open Graph tags for social sharing, Twitter Card, and JSON-LD structured data.
//
// WHY A SEPARATE CONTROLLER?
// SEO is a distinct concern from the product data itself. A product controller
// returns the product's commercial data (price, stock, description). This controller
// returns the product's *search engine identity* (how Google and social platforms
// see it). Keeping them separate follows the Single Responsibility Principle.

const { prisma } = require('../config/db');
const { safePrisma } = require('../utils/safePrisma');


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products/:slug/meta
//
// Response shape (the exact fields Next.js generateMetadata() needs):
// {
//   ok: true,
//   data: {
//     title: "...",           ← goes into <title> and og:title
//     description: "...",     ← goes into <meta name="description"> and og:description
//     canonical: "...",       ← the canonical URL to prevent duplicate content
//     openGraph: { ... },     ← og: tags for Facebook, LinkedIn, WhatsApp previews
//     twitter: { ... },       ← Twitter/X card tags
//     jsonLd: { ... }         ← Structured data for Google's rich results
//   },
//   meta: { requestId, tookMs }
// }
// ─────────────────────────────────────────────────────────────────────────────
async function getProductSeoMeta(req, res) {
  const storeId = req.storeId;   // Injected by tenantResolver
  const { slug } = req.params;   // Captured from the URL: /api/products/:slug/meta
  const requestId = 'req_' + Date.now();

  // Step 1: Fetch the product from DB.
  // We need the product's name, description, price, and our SEO override fields.
  // We also pull in StoreSettings to get the store name for the canonical URL
  // and to enrich the og:site_name tag.
  const result = await safePrisma(
    () => prisma.product.findUnique({
      where: {
        // This uses the compound unique index @@unique([storeId, slug]) from schema.
        // It means: find the product where BOTH storeId AND slug match.
        // This is the multi-tenant safety guard — slug "red-shoes" only returns
        // the product from THIS store, not from another store that also has "red-shoes".
        storeId_slug: { storeId, slug }
      },
      // We only select the fields we need for SEO. No need to pull stockQuantity
      // or categoryId — this keeps the query lean and fast.
      select: {
        name: true,
        slug: true,
        description: true,
        price: true,
        ogImageUrl: true,       // Our custom OG image field added in Day 2 schema
        metaTitle: true,        // Custom <title> override — merchant can set this
        metaDescription: true   // Custom meta description override
      }
    }),
    { fallback: null, context: `seo.getProductMeta(${slug})`, requestId }
  );

  // If the DB query succeeded but product was not found → 404
  if (result.ok && !result.data) {
    return res.status(404).json({
      ok: false,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: `No product found with slug "${slug}" in this store.`
      },
      meta: { requestId }
    });
  }

  // If the DB itself failed → let safePrisma's envelope propagate as 500
  if (!result.ok) {
    return res.status(500).json(result);
  }

  // Step 2: Build the SEO data object from the product.
  const product = result.data;

  // TITLE LOGIC:
  // Merchants can set a custom metaTitle in the DB (e.g., "Buy Red Shoes Online | MyStore").
  // If they haven't, we fall back to the product's name. This is standard SEO practice.
  const title = product.metaTitle || product.name;

  // DESCRIPTION LOGIC:
  // Same pattern — use the custom override if set, otherwise truncate the product
  // description to 160 characters (the recommended SEO limit for meta descriptions).
  const description = product.metaDescription
    || (product.description ? product.description.slice(0, 160) : `Buy ${product.name} online.`);

  // CANONICAL URL:
  // The canonical URL tells Google: "This is the definitive URL for this page."
  // It prevents duplicate content penalties when products appear at multiple URLs.
  // Format: https://<storeId>.evoclabs.shop/products/<slug>
  const canonical = `https://${storeId}.evoclabs.shop/products/${slug}`;

  // Step 3: Assemble the full SEO metadata object.
  // This is the exact structure that maps to Next.js's Metadata API.
  const seoData = {
    // Basic HTML <head> tags
    title,
    description,
    canonical,

    // Open Graph — controls how links look when shared on Facebook, LinkedIn, WhatsApp, Discord
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      // og:image is the thumbnail shown in link previews — very important for CTR
      images: product.ogImageUrl ? [{ url: product.ogImageUrl }] : []
    },

    // Twitter Card — controls how links look when shared on Twitter/X
    twitter: {
      card: 'summary_large_image', // Shows a large image preview (not just a small icon)
      title,
      description,
      images: product.ogImageUrl ? [product.ogImageUrl] : []
    },

    // JSON-LD Structured Data — this is what gives Google rich results (star ratings,
    // price snippets, etc. in search results). Google's crawlers read this to understand
    // what type of content this page contains.
    jsonLd: {
      '@context': 'https://schema.org', // Tells Google we're using Schema.org vocabulary
      '@type': 'Product',               // This page is about a Product
      name: product.name,
      description: product.description || '',
      image: product.ogImageUrl || '',
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'INR',           // Assuming Indian market — can be made dynamic
        availability: 'https://schema.org/InStock'
      }
    }
  };

  // Step 4: Return the standard response envelope with SEO data
  return res.status(200).json({
    ok: true,
    data: seoData,
    meta: { requestId, tookMs: result.meta.tookMs }
  });
}


module.exports = { getProductSeoMeta };
