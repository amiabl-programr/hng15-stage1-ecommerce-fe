import type { Route } from "./+types/store.products.$slug";
import React, { useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  Check,
  ChevronRight,
  HardHat,
  Info,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  Truck,
} from "lucide-react";
import { getProductBySlug } from "~/lib/api/endpoints";
import { formatMoney } from "~/lib/format";
import { site } from "~/lib/site";
import { useCart } from "~/store/cart";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { ProfileDiagram } from "~/components/products/ProfileDiagram";
import { useOptionalToast } from "~/components/ui/Toast";
import type { MediaAsset, Product, ProductVariant } from "~/types/api";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Product Details — ${site.name}` },
    {
      name: "description",
      content: "Buy roofing sheet and profiles with custom length cutting and fast delivery.",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) {
    throw new Response("Product slug is required", { status: 404 });
  }

  try {
    const res = await getProductBySlug(slug);
    if (!res.product) {
      throw new Response("Product not found", { status: 404 });
    }
    return { product: res.product };
  } catch (err) {
    throw new Response("Product not found", { status: 404 });
  }
}

export default function ProductDetailPage() {
  const { product } = useLoaderData<typeof loader>();
  const { addItem } = useCart();
  const toast = useOptionalToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | "diagram">(
    product.media && product.media.length > 0
      ? product.media.find((m) => m.isPrimary) || product.media[0]
      : "diagram"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [lengthMetres, setLengthMetres] = useState<number>(3.0);
  const [colour, setColour] = useState<string>("Traffic Black (RAL 9017)");
  const [finish, setFinish] = useState<string>("Matte Texture");
  const [customNotes, setCustomNotes] = useState<string>("");
  const [added, setAdded] = useState(false);

  // Price calculations
  const unitPrice =
    selectedVariant?.priceOverride != null
      ? selectedVariant.priceOverride
      : product.basePrice;

  const isDimensioned = product.productType === "dimensioned";
  const lineTotal = isDimensioned
    ? Math.round(unitPrice * lengthMetres * quantity)
    : Math.round(unitPrice * quantity);

  const handleAddToCart = () => {
    addItem({
      product,
      variant: selectedVariant,
      quantity,
      customSpecs: isDimensioned
        ? {
            lengthMetres,
            colour,
            finish,
            notes: customNotes.trim() || undefined,
          }
        : undefined,
    });

    setAdded(true);
    toast?.notify(`Added ${quantity}x ${product.name} to order cart`, "success");
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="shell-container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-muted">
        <Link to="/" className="hover:text-fg">Home</Link>
        <ChevronRight className="size-3" />
        <Link to="/products" className="hover:text-fg">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="size-3" />
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-fg">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-fg font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Column: Media & Visuals */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Visual Frame */}
          <div className="aspect-[4/3] w-full rounded-2xl border border-line bg-page overflow-hidden relative flex items-center justify-center p-4">
            {selectedMedia === "diagram" ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <ProfileDiagram
                  kind={product.profileKind}
                  className="w-full h-full max-h-72 object-contain"
                />
                <span className="text-xs font-bold text-muted mt-2">
                  Technical Cross-Section: {product.profileKind.toUpperCase()} Profile
                </span>
              </div>
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.alt || product.name}
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedMedia("diagram")}
              className={`size-20 shrink-0 rounded-xl border p-1 bg-page flex flex-col items-center justify-center transition-all ${
                selectedMedia === "diagram"
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-line hover:border-accent"
              }`}
            >
              <ProfileDiagram kind={product.profileKind} className="w-full h-10" />
              <span className="text-[10px] font-bold text-muted mt-0.5">Profile</span>
            </button>

            {product.media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedMedia(item)}
                className={`relative size-20 shrink-0 rounded-xl border overflow-hidden transition-all ${
                  selectedMedia !== "diagram" && selectedMedia.id === item.id
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-line hover:border-accent"
                }`}
              >
                <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                {item.role && (
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-[9px] text-white py-0.5 text-center uppercase font-bold">
                    {item.role}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Value props */}
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-line bg-raised p-4 text-center">
            <div>
              <Truck className="size-5 text-accent mx-auto mb-1" />
              <span className="text-xs font-bold text-fg block">Nationwide Delivery</span>
              <span className="text-[11px] text-muted">Direct to site</span>
            </div>
            <div>
              <ShieldCheck className="size-5 text-accent mx-auto mb-1" />
              <span className="text-xs font-bold text-fg block">Certified Grade</span>
              <span className="text-[11px] text-muted">AZ150 / 0.55mm</span>
            </div>
            <div>
              <Ruler className="size-5 text-accent mx-auto mb-1" />
              <span className="text-xs font-bold text-fg block">Cut to Length</span>
              <span className="text-[11px] text-muted">Mill precision</span>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration & Add to Cart */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {product.category && <Badge tone="neutral">{product.category.name}</Badge>}
              <Badge tone="accent">{product.profileKind.toUpperCase()}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-fg">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-2 text-sm text-muted leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="my-4 rounded-2xl border border-line bg-raised p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-muted block uppercase font-bold tracking-wider">
                  Rate per {product.unitType}
                </span>
                <span className="text-2xl font-black text-fg">
                  {formatMoney(unitPrice)}
                </span>
              </div>
              {product.minOrderQuantity > 1 && (
                <span className="text-xs font-bold text-muted bg-page border border-line px-2.5 py-1 rounded-full">
                  Min. Order: {product.minOrderQuantity} {product.unitType}s
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                Gauge / Specification:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`btn-press p-3 rounded-xl border text-left transition-all ${
                      selectedVariant?.id === v.id
                        ? "border-accent bg-accent/10 text-accent font-bold ring-1 ring-accent"
                        : "border-line bg-page text-fg hover:border-accent"
                    }`}
                  >
                    <div className="text-xs font-bold">{v.name}</div>
                    <div className="text-[11px] text-muted">SKU: {v.sku}</div>
                    {v.stockQuantity < 5 && (
                      <div className="text-[10px] text-amber-600 font-bold mt-1">
                        Low stock: {v.stockQuantity} left
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dimensioned Length Input */}
          {isDimensioned && (
            <div className="mb-6 rounded-2xl border border-line bg-page p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="lengthMetres" className="text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-1.5">
                    <Ruler className="size-3.5 text-accent" />
                    Cut Length (Metres):
                  </label>
                  <span className="text-xs font-bold text-accent">{lengthMetres.toFixed(1)} m</span>
                </div>
                <input
                  id="lengthMetres"
                  type="number"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={lengthMetres}
                  onChange={(e) => setLengthMetres(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm font-bold focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                  Colour Coating:
                </label>
                <select
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-xs font-bold focus:border-accent"
                >
                  <option value="Traffic Black (RAL 9017)">Traffic Black (RAL 9017)</option>
                  <option value="Nut Brown (RAL 8011)">Nut Brown (RAL 8011)</option>
                  <option value="Moss Green (RAL 6005)">Moss Green (RAL 6005)</option>
                  <option value="Wine Red (RAL 3005)">Wine Red (RAL 3005)</option>
                  <option value="Anthracite Grey (RAL 7016)">Anthracite Grey (RAL 7016)</option>
                  <option value="Natural Mill Finish">Natural Mill Finish Aluminium</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                  Coating Finish:
                </label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-xs font-bold focus:border-accent"
                >
                  <option value="Matte Texture">Matte Texture (Wrinkle)</option>
                  <option value="High Gloss PVDF">High Gloss PVDF</option>
                  <option value="Stone Chip Coated">Stone Chip Coated</option>
                </select>
              </div>
            </div>
          )}

          {/* Quantity Stepper & Subtotal */}
          <div className="mb-6 flex items-center justify-between gap-4 border-t border-line/60 pt-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Quantity:
              </span>
              <div className="flex items-center rounded-lg border border-line bg-page">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="btn-press p-2 text-muted hover:text-fg"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-12 text-center text-sm font-black">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="btn-press p-2 text-muted hover:text-fg"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Line Estimate:
              </span>
              <span className="text-xl font-black text-fg">{formatMoney(lineTotal)}</span>
            </div>
          </div>

          {/* Action Button */}
          {added ? (
            <div className="space-y-2.5 animate-in fade-in">
              <div className="w-full py-3 px-4 rounded-xl bg-emerald-600/10 border border-emerald-600/30 text-emerald-600 flex items-center justify-center gap-2 font-bold text-sm">
                <Check className="size-5" />
                <span>Added to cart successfully!</span>
              </div>
              <Link
                to="/cart"
                className="btn-press w-full py-3.5 px-4 rounded-xl bg-accent text-on-accent flex items-center justify-center gap-2 font-bold text-base shadow-md shadow-accent/20 cursor-pointer"
              >
                <span>View Cart &amp; Proceed to Checkout</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              className="w-full py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-md shadow-accent/15 cursor-pointer"
            >
              <ShoppingCart className="size-5" />
              <span>
                Add {quantity} {isDimensioned ? `(${lengthMetres}m)` : ""} to Cart &bull; {formatMoney(lineTotal)}
              </span>
            </Button>
          )}

          {/* Technical Specs Summary */}
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-sm font-black tracking-tight text-fg mb-3">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-raised">
                <span className="text-muted block font-medium">Profile Geometry</span>
                <span className="font-bold text-fg capitalize">{product.profileKind}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-raised">
                <span className="text-muted block font-medium">Product Type</span>
                <span className="font-bold text-fg capitalize">{product.productType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-raised">
                <span className="text-muted block font-medium">Billing Unit</span>
                <span className="font-bold text-fg capitalize">{product.unitType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-raised">
                <span className="text-muted block font-medium">Min. Order Qty</span>
                <span className="font-bold text-fg">{product.minOrderQuantity} {product.unitType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}