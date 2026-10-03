/**
 * API Contract Types — Roofing Construction Shop
 * Derived from backend contracts in `ecommerce-be/src/contracts` and `openapi.json`.
 */

// ── Common Enums & Primitives ───────────────────────────────────────────────────

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_STATE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export interface FieldIssue {
  path: string;
  message: string;
}

export interface ErrorBody {
  code: ErrorCode;
  message: string;
  fields: FieldIssue[];
}

export interface ErrorEnvelope {
  error: ErrorBody;
}

export type ProfileKind =
  | 'longspan'
  | 'metcoppo'
  | 'step-tile'
  | 'corrugated'
  | 'shingle'
  | 'ridge'
  | 'trimmer'
  | 'flashing'
  | 'gutter'
  | 'fastener'
  | 'roll-forming'
  | 'bending';

export type ImageRole = 'main' | 'profile' | 'installed' | 'detail';

export type PermissionStatus = 'own' | 'approved' | 'pending' | 'not-required';

export type ProductType = 'standard' | 'dimensioned' | 'service';

export type UnitType = 'piece' | 'metre' | 'bundle' | 'sqm' | 'service' | 'roll';

export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'ready_for_delivery'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type UserRole = 'customer' | 'admin';

export type PaymentMethod = 'transfer' | 'cash_on_delivery' | 'card';

// ── Auth & Session ─────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  googleId: string | null;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

export interface MeResponse {
  user: Profile | null;
}

export interface Session {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  userAgent: string | null;
  ip: string | null;
  isCurrent: boolean;
}

export interface SessionListResponse {
  success: true;
  items: Session[];
}

export interface AccountOverviewRecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

export interface AccountOverviewResponse {
  success: true;
  orderCount: number;
  totalSpent: number;
  recentOrders: AccountOverviewRecentOrder[];
}

// ── Catalog & Products ─────────────────────────────────────────────────────────

export interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  role: ImageRole;
  width: number;
  height: number;
  blurhash: string;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  media: MediaAsset[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceOverride?: number | null;
  stockQuantity: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  profileKind: ProfileKind;
  productType: ProductType;
  unitType: UnitType;
  basePrice: number;
  minOrderQuantity: number;
  isActive: boolean;
  category: Category | null;
  media: MediaAsset[];
  variants?: ProductVariant[];
}

export interface ProductListQuery {
  category?: string;
  cursor?: string;
  limit?: number;
}

export interface ProductListResponse {
  success: true;
  items: Product[];
  nextCursor: string | null;
}

export interface CategoryListResponse {
  success: true;
  items: Category[];
}

export interface ProductBySlugResponse {
  success: true;
  product: Product;
}

export interface FeaturedListResponse {
  success: true;
  items: Product[];
}

// ── Checkout & Orders ──────────────────────────────────────────────────────────

export interface CustomSpecs {
  lengthMetres?: number;
  colour?: string;
  finish?: string;
  notes?: string;
}

export interface ServerCartItem {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  productSlug: string;
  mediaUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  customSpecs: CustomSpecs | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: true;
  items: ServerCartItem[];
  subtotal: number;
}

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  customSpecs?: CustomSpecs;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface OrderItemRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  customSpecs?: CustomSpecs;
}

export interface CustomerInput {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  additionalInstructions?: string;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderRequest {
  customer: CustomerInput;
  items: OrderItemRequest[];
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  customSpecs: CustomSpecs | null;
}

export interface DeliveryAddress {
  streetAddress: string;
  city: string;
  state: string;
  additionalInstructions: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  success: true;
  order: Order;
}

export interface OrderListResponse {
  success: true;
  items: Order[];
  nextCursor: string | null;
}

// ── Fabrication ────────────────────────────────────────────────────────────────

export type ServiceType = 'roof' | 'gutter' | 'skylight' | 'cladding' | 'other';
export type FabricationStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
export type ContactPreference = 'email' | 'phone' | 'whatsapp';

export interface FabricationRequestInput {
  serviceType: ServiceType;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  description: string;
  measurements?: string;
  budget?: number;
  preferredContact?: ContactPreference;
}

export interface FabricationRequestRow extends FabricationRequestInput {
  id: string;
  status: FabricationStatus;
  estimatedQuote: number | null;
  createdAt: string;
}

export interface UpdateFabricationStatusInput {
  status: FabricationStatus;
  estimatedQuote?: number;
}

export interface FabricationSubmittedResponse {
  success: true;
  id: string;
  message: string;
}

// ── Admin ──────────────────────────────────────────────────────────────────────

export interface AdminStatsResponse {
  success: true;
  orders: {
    total: number;
    pending: number;
    revenue: number;
  };
  customers: {
    total: number;
  };
  inventory: {
    variants: number;
    lowStock: number;
    outOfStock: number;
  };
  fabricationRequests: {
    new: number;
  };
}

export interface UpsertProductInput {
  name: string;
  slug: string;
  description?: string;
  profileKind: ProfileKind;
  productType: ProductType;
  unitType: UnitType;
  basePrice: number;
  minOrderQuantity: number;
  categoryId?: string | null;
  isActive?: boolean;
}

export type UpdateProductInput = Partial<UpsertProductInput>;

export interface UpsertCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export interface UpdateInventoryInput {
  stockQuantity: number;
}

export interface CustomerRow {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface CustomerListResponse {
  success: true;
  items: CustomerRow[];
  nextCursor: string | null;
}

export interface AdminFabricationListResponse {
  success: true;
  items: FabricationRequestRow[];
}

// ── Media / Image Management ───────────────────────────────────────────────────

export type EntityType = 'product' | 'category';

export interface AdminImage {
  id: string;
  entityType: EntityType;
  entityId: string;
  storagePath: string;
  altText: string;
  role: ImageRole;
  displayOrder: number;
  isPrimary: boolean;
  permissionStatus: PermissionStatus;
  source: string | null;
  licence: string | null;
  width: number;
  height: number;
  bytes: number;
  blurhash: string;
  deletedAt: string | null;
  createdAt: string;
}

export interface AdminImageListResponse {
  success: true;
  items: AdminImage[];
}

export interface UpdateImageInput {
  altText?: string;
  role?: ImageRole;
  displayOrder?: number;
  source?: string;
  licence?: string;
}

export interface SetPermissionInput {
  permissionStatus: PermissionStatus;
}

export interface UploadImageResponse {
  success: true;
  image: AdminImage;
  suggestedAlt: string;
}
