import React, { useState } from 'react';
import { Link } from 'react-router';
import { ShoppingCart, Check, ArrowRight, Layers } from 'lucide-react';
import type { Product } from '~/types/api';
import { ProductMedia } from './ProductMedia';
import { formatMoney } from '~/lib/format';
import { useCart } from '~/store/cart';
import { Badge } from '~/components/ui/Badge';
import { useOptionalToast } from '~/components/ui/Toast';
import { cn } from '~/lib/cn';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const toast = useOptionalToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      product,
      quantity: product.minOrderQuantity || 1,
    });

    setIsAdded(true);
    toast?.notify(`Added ${product.name} to cart`, 'success');

    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-line bg-page overflow-hidden product-card-shadow transition-all duration-200 hover:-translate-y-1 hover:border-accent/40",
        className
      )}
    >
      {/* Product Image / Media */}
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden bg-raised">
        <ProductMedia
          media={product.media}
          profileKind={product.profileKind}
          productName={product.name}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          {product.category ? (
            <Badge tone="neutral" className="shadow-xs backdrop-blur-md bg-page/90">
              {product.category.name}
            </Badge>
          ) : <span />}

          <span className="rounded-md bg-page/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-muted border border-line shadow-xs">
            {product.profileKind}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3">
          <Link
            to={`/products/${product.slug}`}
            className="text-base font-black tracking-tight text-fg hover:text-accent line-clamp-1 transition-colors"
          >
            {product.name}
          </Link>
          {product.description && (
            <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Actions */}
        <div className="mt-auto pt-4 border-t border-line/60 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-muted block font-medium">
                Starting from / {product.unitType}
              </span>
              <span className="text-lg font-black text-fg tracking-tight">
                {formatMoney(product.basePrice)}
              </span>
            </div>

            {product.minOrderQuantity > 1 && (
              <span className="text-[10px] font-bold text-muted bg-raised px-2 py-0.5 rounded-md border border-line">
                Min. {product.minOrderQuantity} {product.unitType}s
              </span>
            )}
          </div>

          {/* Action Buttons: Clear & Explicit */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={cn(
                "btn-press flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs",
                isAdded
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-accent text-on-accent hover:opacity-95 active:scale-98"
              )}
              title={`Add ${product.name} to cart`}
              aria-label={isAdded ? `Added ${product.name} to cart` : `Add ${product.name} to cart`}
            >
              {isAdded ? (
                <>
                  <Check className="size-3.5 shrink-0" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="size-3.5 shrink-0" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <Link
              to={`/products/${product.slug}`}
              className="btn-press flex items-center justify-center gap-1 rounded-xl border border-line bg-raised py-2.5 px-3 text-xs font-bold text-fg hover:border-accent hover:text-accent transition-colors"
              title={`View ${product.name} specs & custom options`}
            >
              <span>Specs</span>
              <ArrowRight className="size-3 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
