import { describe, expect, it } from 'vitest';
import { formatMoney, formatDateTime, formatDate } from './format';

describe('Format utilities', () => {
  it('formats whole Naira money correctly', () => {
    expect(formatMoney(0)).toBe('₦0');
    expect(formatMoney(4500)).toBe('₦4,500');
    expect(formatMoney(1250000)).toBe('₦1,250,000');
    expect(formatMoney(null)).toBe('₦0');
    expect(formatMoney(undefined)).toBe('₦0');
  });

  it('formats date strings', () => {
    const iso = '2026-10-01T12:00:00.000Z';
    expect(formatDate(iso)).toBeDefined();
    expect(formatDateTime(iso)).toBeDefined();
    expect(formatDate(null)).toBe('—');
  });
});
