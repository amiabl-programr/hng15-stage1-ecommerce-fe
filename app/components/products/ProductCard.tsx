import React from 'react';
import { Link } from 'react-router';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '~/types/api';
import { ProductMedia } from './ProductMedia';
import { formatMoney } from '~/lib/format';
import { useCart } from '~/store/cart';
import { Badge } from '~/components/ui/Badge';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product,
      quantity: product.minOrderQuantity || 1,
    });
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border border-line bg-page overflow-hidden product-card-shadow transition-all duration-200 hover:-translate-y-1 ${className || ''}`}
    >
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden">
        <ProductMedia
          media={product.media}
          profileKind={product.profileKind}
          productName={product.name}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.category && (
          <span className="absolute top-3 left-3 z-10">
            <Badge tone="neutral">{product.category.name}</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <Link
            to={`/products/${product.slug}`}
            className="text-base font-black tracking-tight text-fg hover:text-accent line-clamp-1"
          >
            {product.name}
          </Link>
          {product.description && (
            <p className="mt-1 text-xs text-muted line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-line/60">
          <div>
            <span className="text-xs text-muted block">
              Starting from / {product.unitType}
            </span>
            <span className="text-lg font-black text-fg">
              {formatMoney(product.basePrice)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-press p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-on-accent transition-colors"
              title="Quick Add to Cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="size-4" />
            </button>
            <Link
              to={`/products/${product.slug}`}
              className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg hover:bg-line transition-colors"
              title="View details"
              aria-label={`View ${product.name} details`}
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
