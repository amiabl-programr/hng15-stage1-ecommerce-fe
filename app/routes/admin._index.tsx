import type { Route } from "./+types/admin._index";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Layers,
  Package,
  RefreshCw,
  ShoppingBag,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import { getAdminStats } from "~/lib/api/endpoints";
import { formatMoney } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import type { AdminStatsResponse } from "~/types/api";

export function meta() {
  return [{ title: `Admin Dashboard — ${site.name}` }];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminStats();
      setStats(res);
    } catch {
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">Operations</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Operations Dashboard</h1>
          <p className="text-xs text-muted mt-1">
            Real-time business performance, order dispatch, and factory inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={isLoading}
          className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
          title="Refresh metrics"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Aggregating operations metrics...
        </div>
      ) : !stats ? (
        <Card className="p-8 text-center bg-raised border border-line rounded-2xl">
          <AlertTriangle className="size-10 text-amber-500 mx-auto mb-2" />
          <p className="font-bold text-fg">Unable to load dashboard metrics</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5 bg-raised border border-line rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-muted tracking-wider">
                  Total Revenue
                </span>
                <DollarSign className="size-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-fg">
                {formatMoney(stats.orders.revenue)}
              </p>
              <p className="text-[11px] text-muted mt-1">From completed orders</p>
            </Card>

            <Card className="p-5 bg-raised border border-line rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-muted tracking-wider">
                  Orders
                </span>
                <ShoppingBag className="size-4 text-accent" />
              </div>
              <p className="text-2xl font-black text-fg">{stats.orders.total}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge tone={stats.orders.pending > 0 ? "accent" : "neutral"}>
                  {stats.orders.pending} pending
                </Badge>
              </div>
            </Card>

            <Card className="p-5 bg-raised border border-line rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-muted tracking-wider">
                  Stock Alerts
                </span>
                <Warehouse className="size-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-fg">{stats.inventory.lowStock + stats.inventory.outOfStock}</p>
              <p className="text-[11px] text-muted mt-1">
                {stats.inventory.lowStock} low, {stats.inventory.outOfStock} out of stock
              </p>
            </Card>

            <Card className="p-5 bg-raised border border-line rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-muted tracking-wider">
                  Fabrication Inquiries
                </span>
                <Wrench className="size-4 text-accent" />
              </div>
              <p className="text-2xl font-black text-fg">{stats.fabricationRequests.new}</p>
              <p className="text-[11px] text-muted mt-1">Unprocessed quotes</p>
            </Card>
          </div>

          {/* Quick Management Shortcuts */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4">
              Management Portals
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Orders & Fulfillment",
                  desc: "Review orders, dispatch statuses, and waybills.",
                  to: "/admin/orders",
                  icon: ShoppingBag,
                },
                {
                  title: "Product Inventory",
                  desc: "Adjust stock quantities, update variants and SKUs.",
                  to: "/admin/inventory",
                  icon: Warehouse,
                },
                {
                  title: "Catalogue Management",
                  desc: "Create products, edit profiles, and manage images.",
                  to: "/admin/products",
                  icon: Package,
                },
                {
                  title: "Category Structure",
                  desc: "Organise catalogue taxonomy and descriptions.",
                  to: "/admin/categories",
                  icon: Layers,
                },
                {
                  title: "Fabrication Requests",
                  desc: "Review custom roofing quotes and site inquiries.",
                  to: "/admin/fabrication-requests",
                  icon: Wrench,
                },
                {
                  title: "Customer Directory",
                  desc: "View buyer profiles, lifetime spend, and history.",
                  to: "/admin/customers",
                  icon: Users,
                },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="btn-press group p-5 rounded-2xl border border-line bg-raised hover:border-accent flex flex-col justify-between transition-all"
                >
                  <div>
                    <item.icon className="size-6 text-accent mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-fg group-hover:text-accent text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted mt-1">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-bold text-accent">
                    <span>Manage</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}