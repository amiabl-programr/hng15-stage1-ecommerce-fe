import { Link } from "react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Lock } from "lucide-react";
import { useCart } from "~/store/cart";
import { useAuth } from "~/store/session";
import { formatMoney } from "~/lib/format";
import { site } from "~/lib/site";
import { EmptyState } from "~/components/ui/EmptyState";
import { Button, buttonClasses } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";

export function meta() {
  return [{ title: `Shopping Cart — ${site.name}` }];
}

export default function CartPage() {
  const { items, itemCount, subtotal, isHydrated, updateQuantity, removeItem, clearCart } =
    useCart();
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isHydrated) {
    return (
      <div className="shell-container py-16 text-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell-container py-16">
        <h1 className="text-3xl font-black mb-8">Your Cart</h1>
        <EmptyState
          icon={<ShoppingBag aria-hidden className="size-10" />}
          title="Your cart is currently empty"
          description="Explore our range of certified roofing sheets, profiles, and fabrication services."
          action={
            <Link to="/products" className={buttonClasses({ size: "lg" })}>
              Browse Catalogue
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="shell-container py-10 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-fg">Your Cart</h1>
          <p className="text-sm text-muted mt-1">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your order list
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="btn-press text-xs font-bold text-danger hover:underline"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 sm:p-6 bg-page border border-line rounded-2xl max-w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="size-20 rounded-xl object-cover border border-line shrink-0"
                    />
                  ) : (
                    <div className="size-20 rounded-xl bg-raised border border-line flex items-center justify-center shrink-0">
                      <ShoppingBag className="size-8 text-accent/50" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.slug}`}
                      className="text-base font-black text-fg hover:text-accent truncate block"
                    >
                      {item.productName}
                    </Link>

                    {item.variantName && (
                      <p className="text-xs font-bold text-muted mt-0.5">
                        Spec: {item.variantName}
                      </p>
                    )}

                    {item.customSpecs && (
                      <div className="mt-2 text-xs text-muted space-y-0.5 bg-raised p-2 rounded-lg border border-line/50">
                        {item.customSpecs.lengthMetres && (
                          <div>
                            <span className="font-semibold text-fg">Length:</span>{" "}
                            {item.customSpecs.lengthMetres} m
                          </div>
                        )}
                        {item.customSpecs.colour && (
                          <div>
                            <span className="font-semibold text-fg">Colour:</span>{" "}
                            {item.customSpecs.colour}
                          </div>
                        )}
                        {item.customSpecs.finish && (
                          <div>
                            <span className="font-semibold text-fg">Finish:</span>{" "}
                            {item.customSpecs.finish}
                          </div>
                        )}
                        {item.customSpecs.notes && (
                          <div>
                            <span className="font-semibold text-fg">Notes:</span>{" "}
                            {item.customSpecs.notes}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-muted">
                      Rate: <span className="font-bold text-fg">{formatMoney(item.unitPrice)}</span> / {item.unitType}
                    </div>
                  </div>
                </div>

                {/* Right: Quantity Stepper & Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
                  <div className="flex items-center rounded-lg border border-line bg-raised">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn-press p-1.5 text-muted hover:text-fg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn-press p-1.5 text-muted hover:text-fg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-fg">
                      {formatMoney(item.lineTotal)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="btn-press p-1.5 text-danger hover:bg-danger/10 rounded-lg"
                    title="Remove item"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
            >
              <ArrowLeft className="size-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <Card className="p-6 bg-raised border border-line rounded-2xl sm:sticky sm:top-0">
            <h2 className="text-lg font-black tracking-tight text-fg mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm border-b border-line pb-4">
              <div className="flex justify-between">
                <span className="text-muted">Estimated Subtotal</span>
                <span className="font-bold text-fg">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Delivery</span>
                <span className="text-muted">Calculated at checkout</span>
              </div>
            </div>

            <div className="py-4 flex justify-between items-baseline">
              <div>
                <span className="text-base font-black text-fg block">Total Value</span>
                <span className="text-[11px] text-muted">Excludes final delivery offloading</span>
              </div>
              <span className="text-2xl font-black text-fg tracking-tight">{formatMoney(subtotal)}</span>
            </div>

            {isInitialized && !isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/login?redirect=/checkout"
                  className={buttonClasses({
                    size: "lg",
                    className: "w-full py-3.5 flex items-center justify-center gap-2 font-bold shadow-md shadow-accent/15",
                  })}
                >
                  <Lock className="size-4" />
                  <span>Sign In to Checkout</span>
                  <ArrowRight className="size-4" />
                </Link>
                <p className="text-center text-[11px] text-muted leading-tight">
                  Sign in required to verify delivery address and place orders
                </p>
              </div>
            ) : (
              <Link
                to="/checkout"
                className={buttonClasses({
                  size: "lg",
                  className: "w-full py-3.5 flex items-center justify-center gap-2 font-bold shadow-md shadow-accent/15",
                })}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="size-4" />
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}