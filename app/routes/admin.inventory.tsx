import type { Route } from "./+types/admin.inventory";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Minus,
  Plus,
  RefreshCw,
  Save,
  Warehouse,
} from "lucide-react";
import { getAdminInventory, updateInventory, type InventoryItem } from "~/lib/api/endpoints";
import { formatMoney } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";

export function meta() {
  return [{ title: `Inventory & Stock — ${site.name} Admin` }];
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchInventory = async (lowStock = lowStockOnly) => {
    setIsLoading(true);
    try {
      const res = await getAdminInventory(lowStock);
      setItems(res.items || []);
      const initialStock: Record<string, number> = {};
      res.items?.forEach((i) => {
        initialStock[i.id] = i.stockQuantity;
      });
      setStockEdits(initialStock);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(lowStockOnly);
  }, [lowStockOnly]);

  const handleStockChange = (id: string, delta: number) => {
    setStockEdits((prev) => {
      const current = prev[id] ?? 0;
      return { ...prev, [id]: Math.max(0, current + delta) };
    });
  };

  const handleManualInput = (id: string, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setStockEdits((prev) => ({ ...prev, [id]: num }));
  };

  const handleSave = async (variantId: string) => {
    const newQty = stockEdits[variantId];
    if (newQty === undefined) return;

    setSavingId(variantId);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateInventory(variantId, newQty);
      setItems((prev) =>
        prev.map((i) => (i.id === variantId ? { ...i, stockQuantity: newQty } : i))
      );
      setSuccessMessage("Stock quantity updated.");
    } catch {
      setErrorMessage("Failed to update inventory.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">Stockroom</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Inventory Management</h1>
          <p className="text-xs text-muted mt-1">
            Real-time stock quantities across product variants and mill inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchInventory(lowStockOnly)}
            disabled={isLoading}
            className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
            title="Refresh inventory"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`btn-press rounded-lg px-3 py-2 text-xs font-bold border transition-colors ${
              lowStockOnly
                ? "border-amber-500 bg-amber-500/10 text-amber-600"
                : "border-line bg-raised text-muted hover:text-fg"
            }`}
          >
            {lowStockOnly ? "Showing Low Stock Only" : "Show Low Stock Only"}
          </button>
        </div>
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

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading inventory...
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center bg-raised border border-line rounded-2xl">
          <Warehouse className="size-10 text-muted mx-auto mb-2" />
          <p className="font-bold text-fg">No inventory items found</p>
          <p className="text-xs text-muted mt-1">
            {lowStockOnly ? "No variants currently in low stock." : "No variants registered in the system."}
          </p>
        </Card>
      ) : (
        <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product / Variant</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price Rate</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Stock Adjustment</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const currentEdit = stockEdits[item.id] ?? item.stockQuantity;
                const isChanged = currentEdit !== item.stockQuantity;
                const isLow = currentEdit <= 5;
                const isOut = currentEdit === 0;

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-bold text-fg text-sm">{item.productName}</div>
                      <div className="text-xs text-muted">{item.name}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted">
                      {item.sku}
                    </TableCell>
                    <TableCell className="font-bold text-fg text-xs">
                      {formatMoney(item.priceOverride || item.basePrice)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        tone={isOut ? "danger" : isLow ? "warning" : "success"}
                      >
                        {isOut ? "OUT OF STOCK" : isLow ? `LOW: ${currentEdit}` : `${currentEdit} units`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStockChange(item.id, -1)}
                          disabled={currentEdit <= 0}
                          className="btn-press p-1 rounded bg-page border border-line text-muted hover:text-fg disabled:opacity-50"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentEdit}
                          onChange={(e) => handleManualInput(item.id, e.target.value)}
                          className="w-16 rounded border border-line bg-page text-center text-xs font-bold py-1 focus:border-accent"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockChange(item.id, 1)}
                          className="btn-press p-1 rounded bg-page border border-line text-muted hover:text-fg"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant={isChanged ? "primary" : "secondary"}
                        size="sm"
                        disabled={!isChanged || savingId === item.id}
                        onClick={() => handleSave(item.id)}
                        className="text-xs font-bold"
                      >
                        {savingId === item.id ? "Saving..." : "Save"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}