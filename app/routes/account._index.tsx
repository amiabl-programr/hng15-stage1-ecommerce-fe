import type { Route } from "./+types/account._index";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, DollarSign, Package, ShoppingBag, User } from "lucide-react";
import { getAccountOverview } from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { useAuth } from "~/store/session";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";
import type { AccountOverviewResponse } from "~/types/api";

export function meta() {
  return [{ title: `Account Overview — ${site.name}` }];
}

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AccountOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAccountOverview()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      {/* Header Profile Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName || "User Avatar"}
              className="size-14 rounded-2xl object-cover border border-line"
            />
          ) : (
            <div className="size-14 rounded-2xl bg-raised border border-line flex items-center justify-center text-accent font-black text-xl">
              {user?.fullName?.[0] || "U"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-fg">{user?.fullName || "Welcome Back"}</h1>
              {user?.role && (
                <Badge tone={user.role === "admin" ? "accent" : "neutral"}>
                  {user.role.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">{user?.email}</p>
          </div>
        </div>

        <Link
          to="/account/orders"
          className="btn-press self-start sm:self-auto inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
        >
          View all orders
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <Card className="p-6 bg-raised border border-line rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <span className="text-3xl font-black text-fg mt-1 block">
                {isLoading ? "—" : data?.orderCount ?? 0}
              </span>
            </div>
            <div className="size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <ShoppingBag className="size-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-raised border border-line rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Lifetime Value
              </span>
              <span className="text-3xl font-black text-fg mt-1 block">
                {isLoading ? "—" : formatMoney(data?.totalSpent ?? 0)}
              </span>
            </div>
            <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="size-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-fg">Recent Orders</h2>
          <Link
            to="/account/orders"
            className="text-xs font-bold text-muted hover:text-fg"
          >
            See history
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading orders...
          </div>
        ) : !data?.recentOrders || data.recentOrders.length === 0 ? (
          <Card className="p-8 text-center bg-raised border border-line rounded-2xl">
            <Package className="size-10 text-muted mx-auto mb-2" />
            <p className="font-bold text-fg">No orders placed yet</p>
            <p className="text-xs text-muted mt-1 mb-4">
              When you order roofing supplies, they will appear here.
            </p>
            <Link
              to="/products"
              className="btn-press inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-on-accent"
            >
              Start Shopping
            </Link>
          </Card>
        ) : (
          <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((ord) => (
                  <TableRow key={ord.id}>
                    <TableCell className="font-mono font-bold text-fg">
                      {ord.orderNumber}
                    </TableCell>
                    <TableCell className="text-xs text-muted">
                      {formatDateTime(ord.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge tone="accent">{ord.status.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-fg">
                      {formatMoney(ord.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/account/orders/${ord.id}`}
                        className="btn-press text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
                      >
                        Details
                        <ArrowRight className="size-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}