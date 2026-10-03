import type { Route } from "./+types/account.orders";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Package, RefreshCw, ShoppingBag } from "lucide-react";
import { getMyOrders } from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button, buttonClasses } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";
import { DataTable, type Column } from "~/components/ui/Table";
import type { Order } from "~/types/api";

export function meta() {
  return [{ title: `My Orders — ${site.name}` }];
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await getMyOrders({ limit: 20 });
      setOrders(res.items || []);
      setNextCursor(res.nextCursor);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const loadMore = async () => {
    if (!nextCursor) return;
    setIsLoadingMore(true);
    try {
      const res = await getMyOrders({ cursor: nextCursor, limit: 20 });
      setOrders((prev) => [...prev, ...(res.items || [])]);
      setNextCursor(res.nextCursor);
    } catch {
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">Account History</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Order History</h1>
          <p className="text-xs text-muted mt-1">
            Track current deliveries and view previous roofing purchases.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={isLoading}
          className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
          title="Refresh orders"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-10" />}
          title="No orders found"
          description="You have not placed any orders with this account yet."
          action={
            <Link to="/products" className={buttonClasses({ size: "sm" })}>
              Explore Products
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
            <DataTable
              columns={[
                {
                  key: "orderNumber",
                  header: "Order Number",
                  cell: (ord) => <span className="font-mono font-bold text-fg">{ord.orderNumber}</span>,
                  mono: true,
                },
                {
                  key: "date",
                  header: "Date",
                  cell: (ord) => <span className="text-xs text-muted">{formatDateTime(ord.createdAt)}</span>,
                },
                {
                  key: "items",
                  header: "Items",
                  cell: (ord) => <span className="text-xs text-fg">{ord.items.length} {ord.items.length === 1 ? "item" : "items"}</span>,
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (ord) => <Badge tone="accent">{ord.status.toUpperCase()}</Badge>,
                },
                {
                  key: "payment",
                  header: "Payment",
                  cell: (ord) => <Badge tone="neutral">{ord.paymentStatus.toUpperCase()}</Badge>,
                },
                {
                  key: "total",
                  header: "Total",
                  cell: (ord) => <span className="font-bold text-fg">{formatMoney(ord.total)}</span>,
                  mono: true,
                },
                {
                  key: "action",
                  header: "Action",
                  cell: (ord) => (
                    <Link
                      to={`/account/orders/${ord.id}`}
                      className="btn-press text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
                    >
                      View Order
                      <ArrowRight aria-hidden className="size-3" />
                    </Link>
                  ),
                },
              ]}
              rows={orders}
              getRowId={(ord) => ord.id.toString()}
              caption="Order History"
            />
          </Card>

          {nextCursor && (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="text-xs font-bold"
              >
                {isLoadingMore ? "Loading more..." : "Load More Orders"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}