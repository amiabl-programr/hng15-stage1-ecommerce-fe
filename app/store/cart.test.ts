import { describe, expect, it, beforeEach } from 'vitest';
import { useCartStore, calculateLineTotal, generateCartItemId } from './cart';
import type { Product } from '~/types/api';

const mockProduct: Product = {
  id: 'prod-1',
  name: '0.55mm Steeltile Aluminium Sheet',
  slug: 'steeltile-sheet',
  description: 'Test sheet',
  profileKind: 'step-tile',
  productType: 'dimensioned',
  unitType: 'metre',
  basePrice: 4500,
  minOrderQuantity: 1,
  isActive: true,
  category: null,
  media: [],
};

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('calculates line total for dimensioned products based on length', () => {
    const total = calculateLineTotal(4500, 'dimensioned', 2, { lengthMetres: 4.0 });
    expect(total).toBe(4500 * 4 * 2); // 36,000
  });

  it('calculates line total for standard fixed products', () => {
    const total = calculateLineTotal(1200, 'standard', 5);
    expect(total).toBe(6000);
  });

  it('adds items and handles quantity adjustments', () => {
    const store = useCartStore.getState();
    store.addItem({
      product: mockProduct,
      quantity: 3,
      customSpecs: { lengthMetres: 5.0, colour: 'Traffic Black' },
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(items[0].lineTotal).toBe(4500 * 5 * 3);

    // Update quantity
    useCartStore.getState().updateQuantity(items[0].id, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);

    // Remove item
    useCartStore.getState().removeItem(items[0].id);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('cleanCustomSpecs strips empty strings and invalid values', async () => {
    const { cleanCustomSpecs } = await import('./cart');

    expect(cleanCustomSpecs(undefined)).toBeUndefined();
    expect(cleanCustomSpecs({})).toBeUndefined();
    expect(
      cleanCustomSpecs({
        colour: '   ',
        finish: '',
        notes: '',
        lengthMetres: 0,
      })
    ).toBeUndefined();

    expect(
      cleanCustomSpecs({
        colour: ' Wine Red ',
        finish: '',
        notes: ' Fragile offload ',
        lengthMetres: 6.5,
      })
    ).toEqual({
      colour: 'Wine Red',
      notes: 'Fragile offload',
      lengthMetres: 6.5,
    });
  });

  it('generates consistent cart item IDs regardless of whitespace or empty specs', async () => {
    const id1 = generateCartItemId('prod-1', 'var-1', { colour: 'Wine Red' });
    const id2 = generateCartItemId('prod-1', 'var-1', { colour: ' Wine Red ', notes: '' });
    expect(id1).toBe(id2);
  });
});
