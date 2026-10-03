import type { Route } from "./+types/admin.orders";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { getAdminOrders, updateOrderStatus } from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";
import type { Order, OrderStatus, PaymentStatus } from "~/types/api";

export function meta() {
  return [{ title: `Orders & Logistics — ${site.name} Admin` }];
}

export default function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrders = async (status = currentStatus) => {
    setIsLoading(true);
    try {
      const res = await getAdminOrders({ status: status || undefined, limit: 30 });
      setOrders(res.items || []);
      setNextCursor(res.nextCursor);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentStatus);
  }, [currentStatus]);

  const handleStatusFilter = (status: string) => {
    const next = new URLSearchParams(searchParams);
    if (status) {
      next.set("status", status);
    } else {
      next.delete("status");
    }
    setSearchParams(next);
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    setUpdatingId(orderId);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await updateOrderStatus(orderId, { status: newStatus, paymentStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
      setSuccessMessage(`Order ${res.order.orderNumber} transitioned to ${newStatus}.`);
    } catch (err) {
      setErrorMessage("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">Fulfillment</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Order Operations</h1>
          <p className="text-xs text-muted mt-1">
            Dispatch queue, status progression, and waybill tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(currentStatus)}
          disabled={isLoading}
          className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line self-start sm:self-auto"
          title="Refresh orders"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-bold flex items-center gap-2">
          <AlertCircle className="size-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {[
          { id: "", label: "All Orders" },
          { id: "pending", label: "Pending" },
          { id: "processing", label: "In Production" },
          { id: "ready_for_delivery", label: "Ready to Ship" },
          { id: "shipped", label: "In Transit" },
          { id: "completed", label: "Delivered / Done" },
          { id: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleStatusFilter(tab.id)}
            className={`btn-press rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              currentStatus === tab.id
                ? "bg-accent text-on-accent"
                : "border border-line bg-raised text-muted hover:text-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center bg-raised border border-line rounded-2xl">
          <ShoppingBag className="size-10 text-muted mx-auto mb-2" />
          <p className="font-bold text-fg">No orders found</p>
          <p className="text-xs text-muted mt-1">
            {currentStatus
              ? `No orders currently match status "${currentStatus}".`
              : "No customer orders have been recorded."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((ord) => {
                  const isExpanded = expandedId === ord.id;

                  return (
                    <React.Fragment key={ord.id}>
                      <TableRow className={isExpanded ? "bg-page" : ""}>
                        <TableCell className="font-mono font-bold text-fg">
                          {ord.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-fg text-xs">{ord.customerName}</div>
                          <div className="text-[11px] text-muted">{ord.customerPhone}</div>
                        </TableCell>
                        <TableCell className="text-xs text-muted">
                          {formatDateTime(ord.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs text-fg">
                          {ord.items.length} lines
                        </TableCell>
                        <TableCell>
                          <select
                            value={ord.status}
                            disabled={updatingId === ord.id}
                            onChange={(e) =>
                              handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className="rounded border border-line bg-page text-xs font-bold px-2 py-1 focus:border-accent"
                          >
                            <option value="pending">pending</option>
                            <option value="payment_pending">payment_pending</option>
                            <option value="paid">paid</option>
                            <option value="processing">processing</option>
                            <option value="ready_for_delivery">ready_for_delivery</option>
                            <option value="shipped">shipped</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </TableCell>
                        <TableCell className="font-bold text-fg">
                          {formatMoney(ord.total)}
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : ord.id)}
                            className="btn-press p-1.5 text-xs text-muted hover:text-fg"
                            title={isExpanded ? "Collapse" : "Expand details"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </button>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow className="bg-page">
                          <TableCell colSpan={7} className="p-4 border-t border-line/60">
                            <div className="grid gap-6 sm:grid-cols-2 text-xs">
                              {/* Order items */}
                              <div className="space-y-2">
                                <span className="font-bold uppercase text-muted tracking-wider block">
                                  Items Breakdown
                                </span>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                  {ord.items.map((it) => (
                                    <div
                                      key={it.id}
                                      className="p-2 rounded bg-raised flex justify-between items-center"
                                    >
                                      <div>
                                        <p className="font-bold text-fg">{it.productName}</p>
                                        <p className="text-[11px] text-muted">
                                          Qty: {it.quantity} × {formatMoney(it.unitPrice)}
                                          {it.customSpecs?.lengthMetres &&
                                            ` (${it.customSpecs.lengthMetres}m)`}
                                        </p>
                                      </div>
                                      <span className="font-bold">{formatMoney(it.lineTotal)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Delivery & Payment info */}
                              <div className="space-y-3">
                                <div>
                                  <span className="font-bold uppercase text-muted tracking-wider block mb-1">
                                    Delivery Destination
                                  </span>
                                  <p className="font-medium text-fg">
                                    {ord.deliveryAddress.streetAddress}, {ord.deliveryAddress.city},{" "}
                                    {ord.deliveryAddress.state}
                                  </p>
                                  {ord.deliveryAddress.additionalInstructions && (
                                    <p className="text-muted italic mt-0.5">
                                      Instructions: {ord.deliveryAddress.additionalInstructions}
                                    </p>
                                  )}
                                </div>

                                <div className="pt-2 border-t border-line/50 flex items-center justify-between">
                                  <div>
                                    <span className="text-muted block">Payment:</span>
                                    <span className="font-bold text-accent capitalize">
                                      {ord.paymentMethod.replace(/_/g, " ")} (
                                      {ord.paymentStatus})
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-muted block">Subtotal / Total:</span>
                                    <span className="font-bold text-fg">
                                      {formatMoney(ord.subtotal)} / {formatMoney(ord.total)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}