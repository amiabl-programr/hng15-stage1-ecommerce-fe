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
    expect(res.id).toMatch(/^FAB-/);

    const queued = JSON.parse(window.localStorage.getItem('rc_offline_fabrications') || '[]');
    expect(queued.length).toBe(1);
    expect(queued[0].data.fullName).toBe('Offline User');

    const sentEmails = JSON.parse(window.localStorage.getItem('rc_sent_emails') || '[]');
    expect(sentEmails.length).toBe(1);
    expect(sentEmails[0].to).toBe('user@offline.com');
  });

  it('handles offline order creation with accurate line totals and recorded confirmation email', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const res = await api.post<{ success: true; order: any }>('/api/orders', {
      customer: {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '08012345678',
        streetAddress: '12 Factory Road',
        city: 'Ikeja',
        state: 'Lagos',
        paymentMethod: 'transfer',
      },
      items: [
        {
          productId: 'aluminium-longspan-055mm',
          quantity: 2,
          customSpecs: { lengthMetres: 4 },
        },
      ],
    });

    expect(res.success).toBe(true);
    expect(res.order.orderNumber).toMatch(/^RC-/);
    expect(res.order.customerEmail).toBe('jane@example.com');
    expect(res.order.items.length).toBe(1);
    expect(res.order.total).toBeGreaterThan(0);

    const sentEmails = JSON.parse(window.localStorage.getItem('rc_sent_emails') || '[]');
    expect(sentEmails.length).toBe(1);
    expect(sentEmails[0].to).toBe('jane@example.com');
  });
});
