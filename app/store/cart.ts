import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CustomSpecs, Product, ProductType, ProductVariant, UnitType, ServerCartItem } from '~/types/api';
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from '~/lib/api/endpoints';

export interface CartItem {
  id: string; // composite key or server id
  serverId?: string;
  productId: string;
  productName: string;
  slug: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  productType: ProductType;
  unitType: UnitType;
  quantity: number;
  customSpecs?: CustomSpecs;
  imageUrl?: string;
  lineTotal: number;
}

export function generateCartItemId(
  productId: string,
  variantId?: string,
  customSpecs?: CustomSpecs
): string {
  const specsKey = customSpecs
    ? `${customSpecs.lengthMetres || ''}-${customSpecs.colour || ''}-${customSpecs.finish || ''}-${customSpecs.notes || ''}`
    : '';
  return `${productId}:${variantId || ''}:${specsKey}`;
}

export function calculateLineTotal(
  unitPrice: number,
  productType: ProductType,
  quantity: number,
  customSpecs?: CustomSpecs
): number {
  if (productType === 'dimensioned' && customSpecs?.lengthMetres && customSpecs.lengthMetres > 0) {
    return Math.round(unitPrice * customSpecs.lengthMetres * quantity);
  }
  return Math.round(unitPrice * quantity);
}

function mapServerItemToCartItem(si: ServerCartItem): CartItem {
  return {
    id: si.id,
    serverId: si.id,
    productId: si.productId,
    productName: si.productName,
    slug: si.productSlug,
    variantId: si.variantId ?? undefined,
    unitPrice: si.unitPrice,
    productType: 'standard',
    unitType: 'piece',
    quantity: si.quantity,
    customSpecs: si.customSpecs ?? undefined,
    imageUrl: si.mediaUrl ?? undefined,
    lineTotal: si.lineTotal,
  };
}

interface CartStoreState {
  items: CartItem[];
  isHydrated: boolean;

  setHydrated: (state: boolean) => void;
  syncFromServer: () => Promise<void>;
  addItem: (input: {
    product: Product;
    variant?: ProductVariant | null;
    quantity: number;
    customSpecs?: CustomSpecs;
  }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      syncFromServer: async () => {
        try {
          const res = await apiGetCart();
          if (res && Array.isArray(res.items)) {
            const mapped = res.items.map(mapServerItemToCartItem);
            set({ items: mapped });
          }
        } catch {
          // Guest or network failure; continue with local cart
        }
      },

      addItem: ({ product, variant, quantity, customSpecs }) => {
        if (quantity <= 0) return;

        const effectivePrice = variant?.priceOverride != null ? variant.priceOverride : product.basePrice;
        const itemId = generateCartItemId(product.id, variant?.id, customSpecs);
        const primaryMedia = product.media.find((m) => m.isPrimary) || product.media[0];

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === itemId || item.serverId === itemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const existing = updatedItems[existingIndex];
            const newQty = existing.quantity + quantity;
            const newLineTotal = calculateLineTotal(
              existing.unitPrice,
              existing.productType,
              newQty,
              existing.customSpecs
            );

            updatedItems[existingIndex] = {
              ...existing,
              quantity: newQty,
              lineTotal: newLineTotal,
            };

            return { items: updatedItems };
          }

          const newLineTotal = calculateLineTotal(
            effectivePrice,
            product.productType,
            quantity,
            customSpecs
          );

          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            productName: product.name,
            slug: product.slug,
            variantId: variant?.id,
            variantName: variant?.name,
            unitPrice: effectivePrice,
            productType: product.productType,
            unitType: product.unitType,
            quantity,
            customSpecs,
            imageUrl: primaryMedia?.url,
            lineTotal: newLineTotal,
          };

          return { items: [...state.items, newItem] };
        });

        // Sync with backend in background
        apiAddToCart({
          productId: product.id,
          variantId: variant?.id,
          quantity,
          customSpecs,
        })
          .then((res) => {
            if (res && Array.isArray(res.items)) {
              set({ items: res.items.map(mapServerItemToCartItem) });
            }
          })
          .catch(() => {
            // Ignored if user not logged in
          });
      },

      updateQuantity: (id: string, quantity: number) => {
        const currentItem = get().items.find((item) => item.id === id || item.serverId === id);

        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id && item.serverId !== id) };
          }

          return {
            items: state.items.map((item) => {
              if (item.id === id || item.serverId === id) {
                return {
                  ...item,
                  quantity,
                  lineTotal: calculateLineTotal(
                    item.unitPrice,
                    item.productType,
                    quantity,
                    item.customSpecs
                  ),
                };
              }
              return item;
            }),
          };
        });

        const targetId = currentItem?.serverId || id;
        if (targetId) {
          apiUpdateCartItem(targetId, { quantity })
            .then((res) => {
              if (res && Array.isArray(res.items)) {
                set({ items: res.items.map(mapServerItemToCartItem) });
              }
            })
            .catch(() => {});
        }
      },

      removeItem: (id: string) => {
        const currentItem = get().items.find((item) => item.id === id || item.serverId === id);
        const targetId = currentItem?.serverId || id;

        set((state) => ({
          items: state.items.filter((item) => item.id !== id && item.serverId !== id),
        }));

        if (targetId) {
          apiRemoveCartItem(targetId)
            .then((res) => {
              if (res && Array.isArray(res.items)) {
                set({ items: res.items.map(mapServerItemToCartItem) });
              }
            })
            .catch(() => {});
        }
      },

      clearCart: () => {
        set({ items: [] });
        apiClearCart().catch(() => {});
      },
    }),
    {
      name: 'roofing_construction_cart',
      version: 2,
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        // Automatically sync with server once hydrated
        state?.syncFromServer();
      },
    }
  )
);

export function useCart() {
  const store = useCartStore();
  const subtotal = store.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = store.items.reduce((sum, item) => sum + item.quantity, 0);
  const isHydrated = store.isHydrated;

  return {
    items: store.items,
    itemCount: isHydrated ? itemCount : 0,
    subtotal: isHydrated ? subtotal : 0,
    isHydrated,
    syncFromServer: store.syncFromServer,
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
  };
}
