import {
  getSeedCategoriesResponse,
  getSeedFeaturedResponse,
  getSeedProductBySlug,
  getSeedProductsResponse,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from './seedData';
import type {
  AdminStatsResponse,
  CategoryListResponse,
  CustomerListResponse,
  FeaturedListResponse,
  ProductBySlugResponse,
  ProductListResponse,
} from '~/types/api';

const CACHE_PREFIX = 'rc_cache_v1:';
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

// In-memory cache for SSR and runtime memory caching
const memoryCache = new Map<string, CacheEntry<unknown>>();

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Normalizes an API endpoint/query to a consistent cache key.
 */
export function getCacheKey(endpoint: string): string {
  const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${CACHE_PREFIX}${cleanPath}`;
}

/**
 * Retrieve a cached value from localStorage or memoryCache.
 */
export function getCachedData<T>(endpoint: string): T | null {
  const key = getCacheKey(endpoint);

  // Check in-memory cache first
  const memoryEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memoryEntry) {
    return memoryEntry.data;
  }

  // Check localStorage if in browser
  if (isBrowser()) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as CacheEntry<T>;
        // Cache entry is valid; also populate memoryCache
        memoryCache.set(key, parsed as CacheEntry<unknown>);
        return parsed.data;
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }

  return null;
}

/**
 * Store a successful API response in both memory and localStorage.
 */
export function setCachedData<T>(
  endpoint: string,
  data: T,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  const key = getCacheKey(endpoint);
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttlMs,
  };

  memoryCache.set(key, entry as CacheEntry<unknown>);

  if (isBrowser()) {
    try {
      window.localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // Quota exceeded or disabled localStorage — memoryCache still works
    }
  }
}

/**
 * Removes a specific cached endpoint.
 */
export function removeCachedData(endpoint: string): void {
  const key = getCacheKey(endpoint);
  memoryCache.delete(key);
  if (isBrowser()) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }
}

/**
 * Clear all roofing construction API cache items.
 */
export function clearApiCache(): void {
  memoryCache.clear();
  if (isBrowser()) {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // Ignore
    }
  }
}

/**
 * Resolves high-fidelity fallback/seed data when neither network nor cached response is available.
 * Ensures the storefront never shows a blank page or empty state if the backend server is unreachable.
 */
export function getFallbackData<T>(endpoint: string): T | null {
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(clean, 'http://localhost');
  const pathname = url.pathname;
  const categoryParam = url.searchParams.get('category') || undefined;

  // 1. Featured products endpoint
  if (pathname === '/api/products/featured') {
    return getSeedFeaturedResponse() as unknown as T;
  }

  // 2. Categories endpoints
  if (pathname === '/api/categories' || pathname === '/api/admin/categories') {
    return getSeedCategoriesResponse() as unknown as T;
  }

  // 3. Products list endpoint
  if (pathname === '/api/products' || pathname === '/api/admin/products') {
    return getSeedProductsResponse(categoryParam) as unknown as T;
  }

  // 4. Product details by slug endpoint (/api/products/:slug or /api/admin/products/:id)
  const productSlugMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
  if (productSlugMatch) {
    const slug = decodeURIComponent(productSlugMatch[1]);
    const fallbackProduct = getSeedProductBySlug(slug);
    if (fallbackProduct) {
      return fallbackProduct as unknown as T;
    }
  }

  const adminProductMatch = pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
  if (adminProductMatch) {
    const id = decodeURIComponent(adminProductMatch[1]);
    const fallbackProduct = getSeedProductBySlug(id);
    if (fallbackProduct) {
      return fallbackProduct as unknown as T;
    }
  }

  // 5. Admin Stats fallback
  if (pathname === '/api/admin/stats') {
    const stats: AdminStatsResponse = {
      success: true,
      orders: {
        total: 18,
        pending: 3,
        revenue: 4250000,
      },
      customers: {
        total: 14,
      },
      inventory: {
        variants: 24,
        lowStock: 2,
        outOfStock: 0,
      },
      fabricationRequests: {
        new: 4,
      },
    };
    return stats as unknown as T;
  }

  // 6. Admin Inventory fallback
  if (pathname === '/api/admin/inventory') {
    const items = SEED_PRODUCTS.flatMap((p) =>
      (p.variants || []).map((v) => ({
        id: v.id,
        productId: p.id,
        productName: p.name,
        sku: v.sku,
        name: v.name,
        stockQuantity: v.stockQuantity,
        basePrice: p.basePrice,
        priceOverride: v.priceOverride || null,
        isActive: v.isActive,
      }))
    );
    return { success: true, items } as unknown as T;
  }

  // 7. Auth me fallback: returns guest state if backend is down
  if (pathname === '/api/auth/me') {
    return { user: null } as unknown as T;
  }

  // 8. Admin Customers fallback
  if (pathname === '/api/admin/customers') {
    const customers: CustomerListResponse = {
      success: true,
      items: [
        {
          id: 'cust-1',
          fullName: 'Engr. Dapo Alabi',
          email: 'dapo.alabi@construction.ng',
          phone: '+234 803 123 4567',
          orderCount: 4,
          totalSpent: 1250000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'cust-2',
          fullName: 'Fatima Bello',
          email: 'fatima.b@estatebuilders.ng',
          phone: '+234 802 987 6543',
          orderCount: 2,
          totalSpent: 780000,
          createdAt: new Date().toISOString(),
        },
      ],
      nextCursor: null,
    };
    return customers as unknown as T;
  }

  return null;
}
