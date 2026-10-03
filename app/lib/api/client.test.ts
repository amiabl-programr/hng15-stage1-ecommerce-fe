import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { api, ApiError } from './client';
import { clearApiCache, setCachedData } from './cache';
import type { CategoryListResponse, ProductListResponse } from '~/types/api';

describe('API Client with Caching & Offline Fallback', () => {
  beforeEach(() => {
    clearApiCache();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully fetches and caches network response', async () => {
    const mockResponse: CategoryListResponse = {
      success: true,
      items: [
        {
          id: 'test-cat',
          name: 'Custom Category',
          slug: 'custom-category',
          description: 'Desc',
          media: [],
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const data = await api.get<CategoryListResponse>('/api/categories');
    expect(data.items[0].name).toBe('Custom Category');

    // Verify it was cached
    const rawCache = window.localStorage.getItem('rc_cache_v1:/api/categories');
    expect(rawCache).toBeTruthy();
    expect(JSON.parse(rawCache!).data.items[0].name).toBe('Custom Category');
  });

  it('falls back to cached data when server responds with 500 error', async () => {
    const cachedResponse: ProductListResponse = {
      success: true,
      items: [
        {
          id: 'p-cached',
          name: 'Cached Product',
          slug: 'cached-product',
          description: 'Test',
          profileKind: 'longspan',
          productType: 'standard',
          unitType: 'metre',
          basePrice: 5000,
          minOrderQuantity: 1,
          isActive: true,
          category: null,
          media: [],
        },
      ],
      nextCursor: null,
    };

    setCachedData('/api/products', cachedResponse);

    // Mock server 500 Internal Error
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Server down' } }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const res = await api.get<ProductListResponse>('/api/products');
    expect(res.items[0].name).toBe('Cached Product');
  });

  it('falls back to seed data when network fails completely and cache is empty', async () => {
    // Network completely down (Failed to fetch)
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const res = await api.get<CategoryListResponse>('/api/categories');
    expect(res.success).toBe(true);
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items[0].name).toBeTruthy();
  });

  it('handles offline fabrication request submission and stores in offline queue', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const res = await api.post<{ success: true; id: string }>('/api/fabrication-requests', {
      serviceType: 'roof',
      fullName: 'Offline User',
      email: 'user@offline.com',
      phone: '0800000000',
      city: 'Lagos',
      state: 'Lagos',
      description: 'Need 12 sheets rolled on site',
    });

    expect(res.success).toBe(true);
    expect(res.id).toMatch(/^FAB-OFFLINE-/);

    const queued = JSON.parse(window.localStorage.getItem('rc_offline_fabrications') || '[]');
    expect(queued.length).toBe(1);
    expect(queued[0].data.fullName).toBe('Offline User');
  });
});
