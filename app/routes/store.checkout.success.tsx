import type { Route } from "./+types/store.checkout.success";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  HardHat,
  FileText,
  Clock,
  Mail,
} from "lucide-react";
import { getOrderById } from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { buttonClasses } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { getCachedData } from "~/lib/api/cache";
import type { Order } from "~/types/api";

export function meta() {
  return [{ title: `Order Confirmed — ${site.name}` }];
}

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const orderId = searchParams.get("id");
  const orderNumber = searchParams.get("orderNumber");

  // Attempt to recover order from navigation state, session storage, or cache
  const [order, setOrder] = useState<Order | null>(() => {
    const stateOrder = (location.state as { order?: Order } | null)?.order;
    if (stateOrder) return stateOrder;

    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("rc_recent_order");
        if (stored) {
          const parsed = JSON.parse(stored) as Order;
          if (!orderId || parsed.id === orderId || parsed.orderNumber === orderNumber) {
            return parsed;
          }
        }
      } catch {
        // Ignore
      }

      if (orderId) {
        const cached = getCachedData<{ success: true; order: Order }>(`/api/orders/${orderId}`);
        if (cached?.order) return cached.order;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(!order && !!orderId);

  useEffect(() => {
    if (!order && orderId) {
      setIsLoading(true);
      getOrderById(orderId)
        .then((res) => {
          if (res?.order) {
            setOrder(res.order);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("rc_recent_order", JSON.stringify(res.order));
            }
          }
        })
        .catch(() => {
          // If network fetch fails, check cache again
          const cached = getCachedData<{ success: true; order: Order }>(`/api/orders/${orderId}`);
          if (cached?.order) {
            setOrder(cached.order);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [order, orderId]);

  const recipientEmail = order?.customerEmail || "your email address";

  return (
    <div className="shell-container py-12 md:py-20 max-w-3xl">
      <div className="text-center mb-10">
        <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="size-10" />
        </div>
        <p className="eyebrow text-emerald-600 mb-2">Order Confirmed</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-fg">
          Thank you for your order!
        </h1>
        <p className="text-sm text-muted mt-2 max-w-md mx-auto">
          Your roofing order has been placed into our production queue.
        </p>

        {/* Prominent Confirmation Email Notice */}
        <div className="mt-5 max-w-lg mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left flex items-start gap-3">
          <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Confirmation Email Dispatched
            </p>
            <p className="text-xs text-fg mt-0.5 leading-relaxed">
              A verified order invoice and receipt has been sent to{" "}
              <strong className="text-emerald-700 dark:text-emerald-300 break-all">{recipientEmail}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Order Details Summary Card */}
      <Card className="p-6 md:p-8 bg-page border border-line rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <span className="text-xs font-bold text-muted uppercase">Order Reference</span>
            <p className="text-xl font-mono font-black text-fg mt-0.5">
              {order?.orderNumber || orderNumber || "Confirmed"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="accent">{order?.status?.toUpperCase() || "PENDING"}</Badge>
            <Badge tone="neutral">Payment: {order?.paymentStatus?.toUpperCase() || "PENDING"}</Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="size-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted">Retrieving order details...</p>
          </div>
        ) : order ? (
          <div className="py-6 space-y-6 border-b border-line">
            {/* Items List */}
            <div>
              <h3 className="text-xs font-bold uppercase text-muted mb-3">
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-fg">{item.productName}</p>
                      <p className="text-xs text-muted mt-0.5">
                        Qty: {item.quantity} × {formatMoney(item.unitPrice)}
                        {item.customSpecs?.lengthMetres && (
                          <span className="ml-1 text-accent font-semibold">
                            ({item.customSpecs.lengthMetres}m cut)
                          </span>
                        )}
                        {item.customSpecs?.colour && (
                          <span className="ml-1.5 text-muted">
                            • Colour: {item.customSpecs.colour}
                          </span>
                        )}
                        {item.customSpecs?.finish && (
                          <span className="ml-1.5 text-muted">
                            • Finish: {item.customSpecs.finish}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="font-bold text-fg shrink-0">
                      {formatMoney(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Customer Info */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs bg-raised p-4 rounded-xl border border-line/60">
              <div>
                <span className="font-bold text-muted block mb-1">Site Delivery Destination</span>
                <p className="text-fg font-medium">{order.deliveryAddress.streetAddress}</p>
                <p className="text-fg font-medium">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </p>
                {order.deliveryAddress.additionalInstructions && (
                  <p className="text-muted mt-1.5 italic">
                    Note: {order.deliveryAddress.additionalInstructions}
                  </p>
                )}
              </div>

              <div>
                <span className="font-bold text-muted block mb-1">Customer &amp; Contact</span>
                <p className="text-fg font-medium">{order.customerName}</p>
                <p className="text-muted">{order.customerEmail}</p>
                <p className="text-muted">{order.customerPhone}</p>
                <p className="text-muted mt-1.5">
                  Payment Method: <span className="font-bold text-fg capitalize">{order.paymentMethod.replace(/_/g, " ")}</span>
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Site Delivery Fee</span>
                <span>{order.deliveryFee > 0 ? formatMoney(order.deliveryFee) : "Calculated on dispatch"}</span>
              </div>
              <div className="flex justify-between text-base font-black text-fg pt-2 border-t border-line">
                <span>Total Payable</span>
                <span className="text-xl text-accent">{formatMoney(order.total)}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Next Steps */}
        <div className="pt-6">
          <h3 className="text-xs font-bold uppercase text-muted mb-3">What happens next?</h3>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="p-3 rounded-xl bg-raised border border-line/60">
              <Clock className="size-4 text-accent mb-1.5" />
              <span className="font-bold text-fg block">1. Mill Production</span>
              <p className="text-muted mt-0.5">Sheets cut and fabricated to your precise measurements.</p>
            </div>
            <div className="p-3 rounded-xl bg-raised border border-line/60">
              <Truck className="size-4 text-accent mb-1.5" />
              <span className="font-bold text-fg block">2. Logistics Call</span>
              <p className="text-muted mt-0.5">Our driver will verify site access before vehicle dispatch.</p>
            </div>
            <div className="p-3 rounded-xl bg-raised border border-line/60">
              <FileText className="size-4 text-accent mb-1.5" />
              <span className="font-bold text-fg block">3. Site Handover</span>
              <p className="text-muted mt-0.5">Delivery waybill and manufacturer warranty signed off.</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/products" className={buttonClasses({ variant: "secondary", size: "lg" })}>
          Continue Shopping
        </Link>
        <Link to="/account/orders" className={buttonClasses({ size: "lg" })}>
          View My Orders
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}