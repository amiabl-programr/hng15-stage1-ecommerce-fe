import type { Route } from "./+types/store.checkout.success";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  HardHat,
  FileText,
  Clock,
} from "lucide-react";
import { getOrderById } from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { Button, buttonClasses } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import type { Order } from "~/types/api";

export function meta() {
  return [{ title: `Order Confirmed — ${site.name}` }];
}

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then((res) => setOrder(res.order))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [orderId]);

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
          Your roofing order has been placed into our production queue. A confirmation email has been dispatched.
        </p>
      </div>

      {/* Order Details Summary */}
      <Card className="p-6 md:p-8 bg-page border border-line rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <span className="text-xs font-bold text-muted uppercase">Order Reference</span>
            <p className="text-xl font-mono font-black text-fg mt-0.5">
              {order?.orderNumber || orderNumber || "Confirmed"}
            </p>
          </div>

          {order && (
            <div className="flex items-center gap-2">
              <Badge tone="accent">{order.status.toUpperCase()}</Badge>
              <Badge tone="neutral">Payment: {order.paymentStatus.toUpperCase()}</Badge>
            </div>
          )}
        </div>

        {order && (
          <div className="py-6 space-y-6 border-b border-line">
            {/* Items */}
            <div>
              <h3 className="text-xs font-bold uppercase text-muted mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-bold text-fg">{item.productName}</p>
                      <p className="text-xs text-muted">
                        Qty: {item.quantity} × {formatMoney(item.unitPrice)}
                        {item.customSpecs?.lengthMetres && ` (${item.customSpecs.lengthMetres}m)`}
                      </p>
                    </div>
                    <span className="font-bold text-fg">{formatMoney(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs bg-raised p-4 rounded-xl">
              <div>
                <span className="font-bold text-muted block mb-1">Delivery Destination</span>
                <p className="text-fg font-medium">{order.deliveryAddress.streetAddress}</p>
                <p className="text-fg font-medium">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </p>
              </div>

              <div>
                <span className="font-bold text-muted block mb-1">Customer Details</span>
                <p className="text-fg font-medium">{order.customerName}</p>
                <p className="text-muted">{order.customerEmail}</p>
                <p className="text-muted">{order.customerPhone}</p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery Fee</span>
                <span>{formatMoney(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-fg pt-2 border-t border-line">
                <span>Total Payable</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
          </div>
        )}

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