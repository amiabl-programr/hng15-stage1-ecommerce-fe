import type { Route } from "./+types/admin.customers";
import React, { useEffect, useState } from "react";
import { RefreshCw, Users, Mail, Phone, ShoppingBag } from "lucide-react";
import { getAdminCustomers } from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";
import type { CustomerRow } from "~/types/api";

export function meta() {
  return [{ title: `Customers Directory — ${site.name} Admin` }];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCustomers({ limit: 30 });
      setCustomers(res.items || []);
      setNextCursor(res.nextCursor);
    } catch {
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const loadMore = async () => {
    if (!nextCursor) return;
    setIsLoadingMore(true);
    try {
      const res = await getAdminCustomers({ cursor: nextCursor, limit: 30 });
      setCustomers((prev) => [...prev, ...(res.items || [])]);
      setNextCursor(res.nextCursor);
    } catch {
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">CRM</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Customer Directory</h1>
          <p className="text-xs text-muted mt-1">
            Registered customer accounts, contact details, and lifetime order histories.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={isLoading}
          className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
          title="Refresh customers"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading customers...
        </div>
      ) : customers.length === 0 ? (
        <Card className="p-12 text-center bg-raised border border-line rounded-2xl">
          <Users className="size-10 text-muted mx-auto mb-2" />
          <p className="font-bold text-fg">No customers registered yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Lifetime Spend</TableHead>
                  <TableHead className="text-right">Member Since</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-bold text-fg">
                      {c.fullName || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted font-mono">
                      {c.email}
                    </TableCell>
                    <TableCell className="text-xs text-muted">
                      {c.phone || "—"}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-fg">
                      {c.orderCount} {c.orderCount === 1 ? "order" : "orders"}
                    </TableCell>
                    <TableCell className="font-bold text-fg">
                      {formatMoney(c.totalSpent)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted">
                      {formatDateTime(c.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {nextCursor && (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="font-bold text-xs"
              >
                {isLoadingMore ? "Loading more..." : "Load More Customers"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}