import type { Route } from "./+types/account.orders.$id";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  ShieldAlert,
  Truck,
  User,
} from "lucide-react";
import { getOrderById } from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import type { Order } from "~/types/api";

export function meta() {
  return [{ title: `Order Details — ${site.name}` }];
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getOrderById(id)
        .then((res) => setOrder(res.order))
        .catch((err) => {
          setError(
            err.status === 403
              ? "Access denied: You do not have permission to view this order."
              : "Order not found."
          );
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-muted">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <Card className="p-8 text-center bg-raised border border-danger/30 rounded-2xl">
          <ShieldAlert className="size-12 text-danger mx-auto mb-3" />
          <h1 className="text-xl font-black text-fg mb-2">Order Unavailable</h1>
          <p className="text-sm text-muted mb-6">{error || "The requested order could not be loaded."}</p>
          <Link to="/account/orders">
            <Button variant="secondary">Back to My Orders</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-fg mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Back to all orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase text-muted tracking-wider">
            Order Reference
          </span>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-fg mt-0.5">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="accent">{order.status.toUpperCase()}</Badge>
          <Badge tone="neutral">Payment: {order.paymentStatus.toUpperCase()}</Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Items Table */}
        <Card className="p-6 bg-raised border border-line rounded-2xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4">
            Items in Order ({order.items.length})
          </h2>

          <div className="divide-y divide-line/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-fg">{item.productName}</h3>
                  <p className="text-xs text-muted mt-0.5">
                    Qty: {item.quantity} × {formatMoney(item.unitPrice)}
                  </p>

                  {item.customSpecs && (
                    <div className="mt-2 text-xs text-muted flex flex-wrap gap-2">
                      {item.customSpecs.lengthMetres && (
                        <span className="bg-page px-2 py-0.5 rounded border border-line">
                          Length: {item.customSpecs.lengthMetres}m
                        </span>
                      )}
                      {item.customSpecs.colour && (
                        <span className="bg-page px-2 py-0.5 rounded border border-line">
                          Colour: {item.customSpecs.colour}
                        </span>
                      )}
                      {item.customSpecs.finish && (
                        <span className="bg-page px-2 py-0.5 rounded border border-line">
                          Finish: {item.customSpecs.finish}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right font-black text-base text-fg">
                  {formatMoney(item.lineTotal)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery & Customer Info */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-6 bg-raised border border-line rounded-2xl">
            <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-3 flex items-center gap-2">
              <MapPin className="size-4 text-accent" />
              Delivery Destination
            </h2>
            <div className="text-xs space-y-1 text-muted">
              <p className="font-bold text-fg text-sm">{order.deliveryAddress.streetAddress}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
              {order.deliveryAddress.additionalInstructions && (
                <p className="pt-2 text-muted italic">
                  Note: {order.deliveryAddress.additionalInstructions}
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-raised border border-line rounded-2xl">
            <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-3 flex items-center gap-2">
              <CreditCard className="size-4 text-accent" />
              Payment &amp; Contact
            </h2>
            <div className="text-xs space-y-1 text-muted">
              <p className="font-bold text-fg text-sm">{order.customerName}</p>
              <p>{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
              <p className="pt-2 font-bold text-accent capitalize">
                Method: {order.paymentMethod.replace(/_/g, " ")}
              </p>
            </div>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card className="p-6 bg-raised border border-line rounded-2xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4">
            Payment Summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="font-bold text-fg">{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Delivery Fee</span>
              <span className="font-bold text-fg">{formatMoney(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-fg pt-3 border-t border-line">
              <span>Total Paid / Payable</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}