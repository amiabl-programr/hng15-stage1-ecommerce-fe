import { api } from './client';
import type {
  AccountOverviewResponse,
  AddToCartRequest,
  AdminFabricationListResponse,
  AdminImageListResponse,
  AdminImage,
  AdminStatsResponse,
  CartResponse,
  Category,
  CategoryListResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CustomerListResponse,
  EntityType,
  FabricationRequestInput,
  FabricationRequestRow,
  FabricationSubmittedResponse,
  FeaturedListResponse,
  ImageRole,
  MeResponse,
  Order,
  OrderItem,
  OrderListResponse,
  Product,
  ProductBySlugResponse,
  ProductListQuery,
  ProductListResponse,
  Profile,
  SessionListResponse,
  SetPermissionInput,
  UpdateCartItemRequest,
  UpdateFabricationStatusInput,
  UpdateImageInput,
  UpdateOrderStatusInput,
  UploadImageResponse,
  UpsertCategoryInput,
  UpsertProductInput,
} from '~/types/api';

// ── Catalog ───────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryListResponse> {
  return api.get<CategoryListResponse>('/api/categories');
}

export async function getProducts(query: ProductListQuery = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.limit) params.set('limit', String(query.limit));

  const qs = params.toString();
  return api.get<ProductListResponse>(`/api/products${qs ? `?${qs}` : ''}`);
}

export async function getFeaturedProducts(): Promise<FeaturedListResponse> {
  return api.get<FeaturedListResponse>('/api/products/featured');
}

export async function getProductBySlug(slug: string): Promise<ProductBySlugResponse> {
  return api.get<ProductBySlugResponse>(`/api/products/${slug}`);
}

// ── Fabrication ────────────────────────────────────────────────────────────────

export async function submitFabricationRequest(
  data: FabricationRequestInput
): Promise<FabricationSubmittedResponse> {
  return api.post<FabricationSubmittedResponse>('/api/fabrication-requests', data);
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export async function getCart(): Promise<CartResponse> {
  return api.get<CartResponse>('/api/cart');
}

export async function addToCart(data: AddToCartRequest): Promise<CartResponse> {
  return api.post<CartResponse>('/api/cart', data);
}

export async function updateCartItem(
  itemId: string,
  data: UpdateCartItemRequest
): Promise<CartResponse> {
  return api.patch<CartResponse>(`/api/cart/${itemId}`, data);
}

export async function removeCartItem(itemId: string): Promise<CartResponse> {
  return api.delete<CartResponse>(`/api/cart/${itemId}`);
}

export async function clearCart(): Promise<{ success: true }> {
  return api.delete<{ success: true }>('/api/cart');
}

// ── Checkout & Orders ──────────────────────────────────────────────────────────

export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  return api.post<CreateOrderResponse>('/api/orders', data);
}

export async function getMyOrders(params?: {
  cursor?: string;
  limit?: number;
}): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  if (params?.cursor) query.set('cursor', params.cursor);
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return api.get<OrderListResponse>(`/api/orders${qs ? `?${qs}` : ''}`);
}

export async function getOrderById(id: string): Promise<{ success: true; order: Order }> {
  return api.get<{ success: true; order: Order }>(`/api/orders/${id}`);
}

// ── Auth & Account ─────────────────────────────────────────────────────────────

export async function getMe(): Promise<MeResponse> {
  return api.get<MeResponse>('/api/auth/me');
}

export async function logout(): Promise<{ success: true }> {
  return api.post<{ success: true }>('/api/auth/logout');
}

export function getGoogleAuthUrl(next = '/account'): string {
  const baseUrl = typeof window !== 'undefined'
    ? (import.meta.env.VITE_API_URL || 'http://localhost:4000')
    : (process.env.API_URL || 'http://localhost:4000');
  
  return `${baseUrl.replace(/\/+$/, '')}/api/auth/google?next=${encodeURIComponent(next)}`;
}

export async function getAccountOverview(): Promise<AccountOverviewResponse> {
  return api.get<AccountOverviewResponse>('/api/account/overview');
}

export async function getSessions(): Promise<SessionListResponse> {
  return api.get<SessionListResponse>('/api/account/sessions');
}

export async function revokeSession(id: string): Promise<{ success: true }> {
  return api.delete<{ success: true }>(`/api/account/sessions/${id}`);
}

// ── Admin ──────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStatsResponse> {
  return api.get<AdminStatsResponse>('/api/admin/stats');
}

export async function getAdminProducts(): Promise<ProductListResponse> {
  return api.get<ProductListResponse>('/api/admin/products');
}

export async function getAdminProductById(
  id: string
): Promise<{ success: true; product: Product }> {
  return api.get<{ success: true; product: Product }>(`/api/admin/products/${id}`);
}

export async function createAdminProduct(
  data: UpsertProductInput
): Promise<{ success: true; product: Product }> {
  return api.post<{ success: true; product: Product }>('/api/admin/products', data);
}

export async function getAdminCategories(): Promise<CategoryListResponse> {
  return api.get<CategoryListResponse>('/api/admin/categories');
}

export async function createAdminCategory(
  data: UpsertCategoryInput
): Promise<{ success: true; category: Category }> {
  return api.post<{ success: true; category: Category }>('/api/admin/categories', data);
}

export async function getAdminOrders(params?: {
  status?: string;
  cursor?: string;
  limit?: number;
}): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.cursor) query.set('cursor', params.cursor);
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return api.get<OrderListResponse>(`/api/admin/orders${qs ? `?${qs}` : ''}`);
}

export async function updateOrderStatus(
  id: string,
  data: UpdateOrderStatusInput
): Promise<{ success: true; order: Order }> {
  return api.patch<{ success: true; order: Order }>(`/api/admin/orders/${id}/status`, data);
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  name: string;
  stockQuantity: number;
  basePrice: number;
  priceOverride: number | null;
  isActive: boolean;
}

export async function getAdminInventory(
  lowStock = false
): Promise<{ success: true; items: InventoryItem[] }> {
  return api.get<{ success: true; items: InventoryItem[] }>(
    `/api/admin/inventory?lowStock=${lowStock}`
  );
}

export async function updateInventory(
  variantId: string,
  stockQuantity: number
): Promise<{ success: true }> {
  return api.patch<{ success: true }>(`/api/admin/inventory/${variantId}`, { stockQuantity });
}

export async function getAdminCustomers(params?: {
  cursor?: string;
  limit?: number;
}): Promise<CustomerListResponse> {
  const query = new URLSearchParams();
  if (params?.cursor) query.set('cursor', params.cursor);
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return api.get<CustomerListResponse>(`/api/admin/customers${qs ? `?${qs}` : ''}`);
}

export async function getAdminFabricationRequests(
  status?: string
): Promise<AdminFabricationListResponse> {
  const query = new URLSearchParams();
  if (status) query.set('status', status);

  const qs = query.toString();
  return api.get<AdminFabricationListResponse>(
    `/api/admin/fabrication-requests${qs ? `?${qs}` : ''}`
  );
}

export async function updateFabricationStatus(
  id: string,
  data: UpdateFabricationStatusInput
): Promise<{ success: true; item: FabricationRequestRow }> {
  return api.patch<{ success: true; item: FabricationRequestRow }>(
    `/api/admin/fabrication-requests/${id}/status`,
    data
  );
}

// ── Media / Images ───────────────────────────────────────────────────────────

export async function getMediaForEntity(
  entityType: EntityType,
  entityId: string
): Promise<AdminImageListResponse> {
  return api.get<AdminImageListResponse>(`/api/media/${entityType}/${entityId}`);
}

export async function uploadImage(
  file: File,
  entityType: EntityType,
  entityId: string,
  role: ImageRole,
  altText: string
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', entityType);
  formData.append('entityId', entityId);
  formData.append('role', role);
  formData.append('altText', altText);

  return api.post<UploadImageResponse>('/api/media/upload', formData);
}

export async function attachImage(
  entityType: EntityType,
  entityId: string,
  data: {
    storagePath: string;
    altText: string;
    role: ImageRole;
  }
): Promise<{ success: true; image: AdminImage }> {
  return api.post<{ success: true; image: AdminImage }>(
    `/api/media/${entityType}/${entityId}/attach`,
    data
  );
}

export async function updateImage(
  id: string,
  data: UpdateImageInput
): Promise<{ success: true; image: AdminImage }> {
  return api.patch<{ success: true; image: AdminImage }>(`/api/media/${id}`, data);
}

export async function setPrimaryImage(
  productId: string,
  imageId: string
): Promise<{ success: true }> {
  return api.put<{ success: true }>(`/api/media/products/${productId}/primary`, { imageId });
}

export async function setImagePermission(
  id: string,
  data: SetPermissionInput
): Promise<{ success: true; image: AdminImage }> {
  return api.patch<{ success: true; image: AdminImage }>(`/api/media/${id}/permission`, data);
}

export async function deleteImage(id: string): Promise<{ success: true }> {
  return api.delete<{ success: true }>(`/api/media/${id}`);
}
