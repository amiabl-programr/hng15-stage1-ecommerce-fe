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
  id: string; // composite key
  serverId?: string; // backend database UUID in cart_items table
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

/**
 * Strips empty strings, NaN, or invalid fields so customSpecs strictly complies
 * with the backend CustomSpecsSchema (z.strictObject).
 */
export function cleanCustomSpecs(specs?: CustomSpecs | null): CustomSpecs | undefined {
  if (!specs) return undefined;
  const cleaned: CustomSpecs = {};
  if (typeof specs.lengthMetres === 'number' && specs.lengthMetres > 0) {
    cleaned.lengthMetres = Number(specs.lengthMetres);
  }
  if (specs.colour && specs.colour.trim().length > 0) {
    cleaned.colour = specs.colour.trim();
  }
  if (specs.finish && specs.finish.trim().length > 0) {
    cleaned.finish = specs.finish.trim();
  }
  if (specs.notes && specs.notes.trim().length > 0) {
    cleaned.notes = specs.notes.trim();
  }
  if (Object.keys(cleaned).length === 0) {
    return undefined;
  }
  return cleaned;
}

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(id?: string | null): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id.trim());
}

export function generateCartItemId(
  productId: string,
  variantId?: string,
  customSpecs?: CustomSpecs
): string {
  const specs = cleanCustomSpecs(customSpecs);
  const specsKey = specs
    ? `${specs.lengthMetres || ''}-${specs.colour || ''}-${specs.finish || ''}-${specs.notes || ''}`
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
  const specs = cleanCustomSpecs(si.customSpecs);
  const compositeId = generateCartItemId(si.productId, si.variantId ?? undefined, specs);
  const isDimensioned = Boolean(specs?.lengthMetres && specs.lengthMetres > 0);

  return {
    id: compositeId,
    serverId: si.id,
    productId: si.productId,
    productName: si.productName,
    slug: si.productSlug,
    variantId: si.variantId ?? undefined,
    unitPrice: si.unitPrice,
    productType: isDimensioned ? 'dimensioned' : 'standard',
    unitType: isDimensioned ? 'metre' : 'piece',
    quantity: si.quantity,
    customSpecs: specs,
    imageUrl: si.mediaUrl ?? undefined,
    lineTotal: si.lineTotal,
  };
}

interface CartStoreState {
  items: CartItem[];
  isHydrated: boolean;
  isSyncing: boolean;

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
      isSyncing: false,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      syncFromServer: async () => {
        try {
          set({ isSyncing: true });
          const res = await apiGetCart();
          if (!res || !Array.isArray(res.items)) {
            set({ isSyncing: false });
            return;
          }

          const localItems = get().items;
          const serverItems = res.items;

          // Detect local items that have not yet been stored on the server
          // (for instance, items added while user was an anonymous guest)
          // Exclude any legacy mock items with non-UUID product IDs
          const unsyncedItems = localItems.filter((local) => {
            if (!isValidUuid(local.productId)) return false;
            if (!local.serverId) return true;
            return !serverItems.some((s) => s.id === local.serverId);
          });

          if (unsyncedItems.length > 0) {
            // Push guest/offline items to user's server cart
            for (const item of unsyncedItems) {
              try {
                await apiAddToCart({
                  productId: item.productId,
                  variantId: item.variantId || undefined,
                  quantity: item.quantity,
                  customSpecs: cleanCustomSpecs(item.customSpecs),
                });
              } catch {
                // If single item fails (e.g. invalid test mock id), continue with rest
              }
            }

            // Re-fetch merged unified cart from server
            const mergedRes = await apiGetCart();
            if (mergedRes && Array.isArray(mergedRes.items)) {
              set({
                items: mergedRes.items.map(mapServerItemToCartItem),
                isSyncing: false,
              });
              return;
            }
          }

          // If no unsynced local items, align with the server cart
          if (serverItems.length > 0) {
            set({
              items: serverItems.map(mapServerItemToCartItem),
              isSyncing: false,
            });
          } else if (localItems.length === 0) {
            set({ items: [], isSyncing: false });
          } else {
            set({ isSyncing: false });
          }
        } catch {
          // Guest or network failure; continue with local cart
          set({ isSyncing: false });
        }
      },

      addItem: ({ product, variant, quantity, customSpecs }) => {
        if (quantity <= 0) return;

        const effectivePrice = variant?.priceOverride != null ? variant.priceOverride : product.basePrice;
        const cleanedSpecs = cleanCustomSpecs(customSpecs);
        const itemId = generateCartItemId(product.id, variant?.id, cleanedSpecs);
        const primaryMedia = product.media.find((m) => m.isPrimary) || product.media[0];

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.id === itemId || item.serverId === itemId
          );

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
            cleanedSpecs
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
            customSpecs: cleanedSpecs,
            imageUrl: primaryMedia?.url,
            lineTotal: newLineTotal,
          };

          return { items: [...state.items, newItem] };
        });

        // Sync with backend in background if product has a valid UUID
        if (isValidUuid(product.id)) {
          apiAddToCart({
            productId: product.id,
            variantId: variant?.id && isValidUuid(variant.id) ? variant.id : undefined,
            quantity,
            customSpecs: cleanedSpecs,
          })
            .then((res) => {
              if (res && Array.isArray(res.items)) {
                set({ items: res.items.map(mapServerItemToCartItem) });
              }
            })
            .catch(() => {
              // Ignored if user not logged in; local state is preserved
            });
        }
      },

      updateQuantity: (id: string, quantity: number) => {
        const currentItem = get().items.find((item) => item.id === id || item.serverId === id);
        const serverId = currentItem?.serverId;

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

        if (serverId) {
          if (quantity <= 0) {
            apiRemoveCartItem(serverId)
              .then((res) => {
                if (res && Array.isArray(res.items)) {
                  set({ items: res.items.map(mapServerItemToCartItem) });
                }
              })
              .catch(() => {});
          } else {
            apiUpdateCartItem(serverId, { quantity })
              .then((res) => {
                if (res && Array.isArray(res.items)) {
                  set({ items: res.items.map(mapServerItemToCartItem) });
                }
              })
              .catch(() => {});
          }
        }
      },

      removeItem: (id: string) => {
        const currentItem = get().items.find((item) => item.id === id || item.serverId === id);
        const serverId = currentItem?.serverId;

        set((state) => ({
          items: state.items.filter((item) => item.id !== id && item.serverId !== id),
        }));

        if (serverId) {
          apiRemoveCartItem(serverId)
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
        // Automatically prune legacy mock items that don't have valid UUIDs from previous dev/offline sessions
        if (state && Array.isArray(state.items)) {
          const valid = state.items.filter((item) => isValidUuid(item.productId));
          if (valid.length !== state.items.length) {
            state.items = valid;
          }
        }
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
    isSyncing: store.isSyncing,
    syncFromServer: store.syncFromServer,
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
  };
}
