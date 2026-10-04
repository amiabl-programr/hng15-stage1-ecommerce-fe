import { describe, it, expect, beforeEach } from 'vitest';
import {
  clearApiCache,
  getCachedData,
  getCacheKey,
  getFallbackData,
  setCachedData,
} from './cache';
import type {
  CategoryListResponse,
  FeaturedListResponse,
  ProductBySlugResponse,
  ProductListResponse,
} from '~/types/api';

describe('API Cache Layer', () => {
  beforeEach(() => {
    clearApiCache();
    window.localStorage.clear();
  });

  it('generates consistent cache keys with prefix', () => {
    expect(getCacheKey('/api/products')).toBe('rc_cache_v2:/api/products');
    expect(getCacheKey('api/products')).toBe('rc_cache_v2:/api/products');
  });

  it('stores and retrieves cached data from memory and localStorage', () => {
    const mockData = { success: true as const, items: [{ id: '1', name: 'Test' }] };
    setCachedData('/api/test-endpoint', mockData);

    const retrieved = getCachedData<typeof mockData>('/api/test-endpoint');
    expect(retrieved).toEqual(mockData);

    // Verify written to localStorage
    const rawLocal = window.localStorage.getItem('rc_cache_v2:/api/test-endpoint');
    expect(rawLocal).toBeTruthy();
    expect(JSON.parse(rawLocal!).data).toEqual(mockData);
  });

  it('clears all cached items correctly', () => {
    setCachedData('/api/item1', { name: 'One' });
    setCachedData('/api/item2', { name: 'Two' });

    expect(getCachedData('/api/item1')).toBeTruthy();
    expect(getCachedData('/api/item2')).toBeTruthy();

    clearApiCache();

    expect(getCachedData('/api/item1')).toBeNull();
    expect(getCachedData('/api/item2')).toBeNull();
  });

  it('returns high-quality fallback data for featured products when offline', () => {
    const fallback = getFallbackData<FeaturedListResponse>('/api/products/featured');
    expect(fallback).not.toBeNull();
    expect(fallback?.success).toBe(true);
    expect(fallback?.items.length).toBeGreaterThan(0);
    expect(fallback?.items[0].name).toBeTruthy();
  });

  it('returns high-quality fallback data for categories when offline', () => {
    const fallback = getFallbackData<CategoryListResponse>('/api/categories');
    expect(fallback).not.toBeNull();
    expect(fallback?.success).toBe(true);
    expect(fallback?.items.length).toBeGreaterThanOrEqual(4);
    expect(fallback?.items.some((c) => c.slug === 'roofing-sheets')).toBe(true);
  });

  it('returns high-quality fallback data for products catalogue and category filtering', () => {
    const fallbackAll = getFallbackData<ProductListResponse>('/api/products');
    expect(fallbackAll).not.toBeNull();
    expect(fallbackAll?.items.length).toBeGreaterThanOrEqual(5);

    const fallbackFiltered = getFallbackData<ProductListResponse>(
      '/api/products?category=roofing-sheets'
    );
    expect(fallbackFiltered).not.toBeNull();
    expect(fallbackFiltered?.items.every((p) => p.category?.slug === 'roofing-sheets')).toBe(
      true
    );
  });

  it('returns fallback product details by slug', () => {
    const fallback = getFallbackData<ProductBySlugResponse>(
      '/api/products/premium-longspan-aluminium-roofing-sheet'
    );
    expect(fallback).not.toBeNull();
    expect(fallback?.product.name).toContain('Premium Longspan');
    expect(fallback?.product.profileKind).toBe('longspan');
  });
});
