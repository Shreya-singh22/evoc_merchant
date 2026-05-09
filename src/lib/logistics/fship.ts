// lib/logistics/fship.js
//
// FShip API client. Uses native fetch (built into Node 18+ and Next.js).
// No axios needed — saves a dependency.

import { OrbitApiError } from '../orbit-api-error';

const FSHIP_BASE = process.env.FSHIP_BASE_URL || 'https://api.fship.in';
const TIMEOUT_MS = 8000;

async function fshipFetch(path, { method = 'GET', apiKey, body, params, requestId } = {}) {
  let url = `${FSHIP_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += '?' + qs;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (response.status === 404) {
      // Pincode not in FShip's serviceability table — treat as not serviceable
      return { notFound: true };
    }
    if (!response.ok) {
      throw new OrbitApiError(
        'LOGISTICS_API_ERROR',
        `FShip returned ${response.status}.`,
        requestId,
        502,
      );
    }
    return { data: await response.json() };
  } catch (err) {
    if (err instanceof OrbitApiError) throw err;
    throw new OrbitApiError(
      'LOGISTICS_API_ERROR',
      'Failed to reach logistics provider.',
      requestId,
      502,
    );
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Check pincode serviceability.
 * Returns the spec's expected shape: { serviceable, codEligible, estimatedDays, etaMessage }
 */
export async function checkPincodeWithFShip({ pincode, apiKey, requestId }) {
  const result = await fshipFetch('/api/pincode/check', {
    method: 'POST',
    apiKey,
    body: { pincode },
    requestId,
  });

  if (result.notFound) {
    return {
      serviceable: false,
      codEligible: false,
      estimatedDays: null,
      etaMessage: 'Not serviceable',
    };
  }

  const data = result.data;
  const serviceable = !!(data.serviceable || data.is_serviceable || data.status === 'serviceable');

  return {
    serviceable,
    codEligible: serviceable ? !!(data.cod_available || data.codEligible) : false,
    estimatedDays: data.tat || data.estimated_days || data.estimatedDays || null,
    etaMessage:
      data.eta_message ||
      data.etaMessage ||
      (serviceable ? 'Delivery available' : 'Not serviceable'),
  };
}
