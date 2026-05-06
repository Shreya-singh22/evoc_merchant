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
}

// Export a single instance so we can reuse it anywhere in our app
const catalogClient = new CatalogClient();

module.exports = {
  catalogClient,
  CatalogClient
};
