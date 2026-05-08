// evoc-backend/client/catalog-client.js
// Make sure to configure 'dotenv' in your main server file (e.g. index.js) so this can read the .env variables.

class CatalogClient {
  constructor() {
    // THOUGHT 1: Load the URL from environment variables.
    // If it's missing, we throw an error immediately so the app fails fast on startup.
    const url = process.env.CATALOG_API_URL;
    if (!url) {
      // It won't crash immediately when imported, but it will throw when you try to instantiate it
      console.warn("WARNING: CATALOG_API_URL is missing in .env file");
    }
    this.baseUrl = url || 'http://localhost:4000';
  }

  // THOUGHT 2: A private helper method to handle ALL requests consistently.
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Default headers, automatically sending JSON
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      // Note: fetch is globally available in Node 18+
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      // THOUGHT 3: If the external API fails, we throw an error.
      // (This handles the { ok: false, error: {...} } shape we discussed earlier)
      if (!response.ok) {
        throw new Error(data.error?.message || `Catalog API Error: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`[CatalogClient] Failed to fetch ${url}`, error);
      throw error;
    }
  }

  // --- SDK METHODS ---
  // Now we just use our _request helper to define actual endpoints!

  /**
   * Fetches a list of all products from the catalog.
   */
  async getProducts() {
    return this._request('/products', { method: 'GET' });
  }

  /**
   * Fetches a single product by ID.
   */
  async getProductBySlug(slug) {
    return this._request(`/products/${slug}`, { method: 'GET' });
  }

  /**
   * Fetches a list of all categories.
   */
  async getCategories() {
    return this._request('/categories', { method: 'GET' });
  }

  /**
   * Fetches a single category by slug.
   */
  async getCategoryBySlug(slug) {
    return this._request(`/categories/${slug}`, { method: 'GET' });
  }

  /**
   * Example of sending an Idempotency-Key for a state-changing request
   */
  async reserveInventory(productId, quantity, idempotencyKey) {
    return this._request(`/inventory/reserve`, {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({ productId, quantity })
    });
  }

  // ─── DAY 2 SDK METHODS ────────────────────────────────────────────────────
  // These mirror the new backend endpoints built on Day 2.
  // The storefront (Next.js) will import this SDK and call these methods
  // in Server Components — so the fetch happens server-side, not in the browser.

  /**
   * Fetches the visual branding for this store.
   * Returns: { storeName, logoUrl, brandColor, tagline }
   *
   * WHY: The storefront header/layout needs the logo URL and brand color
   * to render correctly. Calling this once in the root layout is efficient.
   */
  async getStoreSettings() {
    // _request automatically prepends this.baseUrl and sets Content-Type headers
    return this._request('/store/settings', { method: 'GET' });
  }

  /**
   * Fetches the contact information for this store.
   * Returns: { email, phone, address, city, country }
   *
   * WHY: The storefront footer and /contact page need this data.
   */
  async getStoreContact() {
    return this._request('/store/contact', { method: 'GET' });
  }

  /**
   * Fetches the legal policy text for this store.
   * Returns: { shippingPolicy, returnPolicy, privacyPolicy }
   *
   * WHY: The /shipping, /returns, /privacy pages on the storefront render this text.
   * Keeping it in the DB means merchants can update it without code deploys.
   */
  async getStorePolicies() {
    return this._request('/store/policies', { method: 'GET' });
  }

  /**
   * Fetches SEO metadata for a specific product page.
   * Returns: { title, description, canonical, openGraph, twitter, jsonLd }
   *
   * WHY: Next.js generateMetadata() calls this on the server before rendering
   * the Product Detail Page (PDP). The returned data populates the <head>:
   *   - <title> and <meta name="description">
   *   - og:title, og:description, og:image (for social sharing previews)
   *   - Twitter card tags
   *   - application/ld+json (for Google rich results)
   *
   * @param {string} slug - The product slug e.g. "red-running-shoes"
   */
  async getProductSeoMeta(slug) {
    // Note: slug is interpolated into the URL path, same pattern as getProductBySlug
    return this._request(`/products/${slug}/meta`, { method: 'GET' });
  }
}


// Export a single instance so we can reuse it anywhere in our app
const catalogClient = new CatalogClient();

module.exports = {
  catalogClient,
  CatalogClient
};
