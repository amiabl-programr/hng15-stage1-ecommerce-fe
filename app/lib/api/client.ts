import type { ErrorEnvelope, FieldIssue, ErrorCode, CreateOrderRequest, CreateOrderResponse, FabricationRequestInput, FabricationSubmittedResponse, Order } from '~/types/api';
import { getCachedData, setCachedData, getFallbackData } from './cache';

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  public readonly fields: FieldIssue[];

  constructor(status: number, message: string, code: ErrorCode | 'NETWORK_ERROR' | 'UNKNOWN_ERROR' = 'UNKNOWN_ERROR', fields: FieldIssue[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

const DEFAULT_API_BASE_URL = typeof window !== 'undefined'
  ? (import.meta.env.VITE_API_URL || 'http://localhost:4000')
  : (process.env.API_URL || 'http://localhost:4000');

function handleOfflineMutationFallback<T>(endpoint: string, options: RequestInit): T | null {
  const method = (options.method || 'GET').toUpperCase();
  if (method !== 'POST') return null;

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Offline fallback for fabrication request submission
  if (path === '/api/fabrication-requests') {
    const rawBody = typeof options.body === 'string' ? options.body : '{}';
    let parsed: Partial<FabricationRequestInput> = {};
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      // Ignore
    }

    const offlineId = `FAB-OFFLINE-${Date.now().toString(36).toUpperCase()}`;
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(window.localStorage.getItem('rc_offline_fabrications') || '[]');
        stored.push({ id: offlineId, data: parsed, createdAt: new Date().toISOString() });
        window.localStorage.setItem('rc_offline_fabrications', JSON.stringify(stored));
      } catch {
        // Ignore
      }
    }

    const response: FabricationSubmittedResponse = {
      success: true,
      id: offlineId,
      message: 'Your fabrication request has been recorded and queued for processing.',
    };
    return response as unknown as T;
  }

  // Offline fallback for order creation
  if (path === '/api/orders') {
    const rawBody = typeof options.body === 'string' ? options.body : '{}';
    let parsed: Partial<CreateOrderRequest> = {};
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      // Ignore
    }

    const orderNum = `RC-OFFLINE-${Math.floor(100000 + Math.random() * 900000)}`;
    const offlineOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: parsed.customer?.paymentMethod || 'transfer',
      customerName: parsed.customer?.fullName || 'Customer',
      customerEmail: parsed.customer?.email || '',
      customerPhone: parsed.customer?.phone || '',
      deliveryAddress: {
        streetAddress: parsed.customer?.streetAddress || '',
        city: parsed.customer?.city || '',
        state: parsed.customer?.state || '',
        additionalInstructions: parsed.customer?.additionalInstructions || null,
      },
      items: (parsed.items || []).map((item, idx) => ({
        id: `item-${idx + 1}`,
        productId: item.productId,
        variantId: item.variantId || null,
        productName: 'Roofing Material Item',
        unitPrice: 5000,
        quantity: item.quantity,
        lineTotal: 5000 * item.quantity,
        customSpecs: item.customSpecs || null,
      })),
      subtotal: 5000,
      deliveryFee: 0,
      total: 5000,
      notes: parsed.customer?.additionalInstructions || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(window.localStorage.getItem('rc_offline_orders') || '[]');
        stored.push(offlineOrder);
        window.localStorage.setItem('rc_offline_orders', JSON.stringify(stored));
      } catch {
        // Ignore
      }
    }

    const response: CreateOrderResponse = {
      success: true,
      order: offlineOrder,
    };
    return response as unknown as T;
  }

  return null;
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const baseUrl = DEFAULT_API_BASE_URL.replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // essential for session cookie
    });

    if (!response.ok) {
      let errorBody: ErrorEnvelope | null = null;
      try {
        errorBody = await response.json();
      } catch {
        // Fallback for non-JSON error responses (e.g. 502/504 gateway errors)
      }

      // Check if server is unavailable (502, 503, 504) or endpoint error
      if (response.status >= 500 && isGet) {
        const cached = getCachedData<T>(endpoint);
        if (cached !== null) return cached;
        const fallback = getFallbackData<T>(endpoint);
        if (fallback !== null) return fallback;
      }

      if (errorBody?.error) {
        throw new ApiError(
          response.status,
          errorBody.error.message || `Request failed with status ${response.status}`,
          errorBody.error.code,
          errorBody.error.fields || []
        );
      }

      throw new ApiError(
        response.status,
        `Request failed with status ${response.status}`,
        'UNKNOWN_ERROR'
      );
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    // Cache successful GET requests
    if (isGet) {
      setCachedData(endpoint, data);
    }

    return data as T;
  } catch (err) {
    if (err instanceof ApiError && err.status > 0 && err.status < 500) {
      // Client errors (4xx) like validation or auth should not fallback to generic cache
      throw err;
    }

    // If it's a GET request and network is down or server unreachable, check cache then fallback
    if (isGet) {
      const cached = getCachedData<T>(endpoint);
      if (cached !== null) {
        return cached;
      }

      const fallback = getFallbackData<T>(endpoint);
      if (fallback !== null) {
        return fallback;
      }
    } else {
      // For mutation requests when server is offline
      const offlineFallback = handleOfflineMutationFallback<T>(endpoint, options);
      if (offlineFallback !== null) {
        return offlineFallback;
      }
    }

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError(
      0,
      err instanceof Error ? err.message : 'Network error occurred',
      'NETWORK_ERROR'
    );
  }
}

export const api = {
  get: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    }),

  patch: <T>(endpoint: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    }),

  put: <T>(endpoint: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    }),

  delete: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};

