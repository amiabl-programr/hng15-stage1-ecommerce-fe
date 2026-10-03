import type { Route } from "./+types/admin.products";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ExternalLink, ImageIcon, Package, Plus, RefreshCw, Layers } from "lucide-react";
import { getAdminProducts } from "~/lib/api/endpoints";
import { formatMoney } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button, buttonClasses } from "~/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";
import type { Product } from "~/types/api";

export function meta() {
  return [{ title: `Products Management — ${site.name} Admin` }];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminProducts();
      setProducts(res.items || []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">Catalogue</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Product Catalogue</h1>
          <p className="text-xs text-muted mt-1">
            Manage roofing products, technical profile geometries, and imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={isLoading}
            className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
            title="Refresh catalogue"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Link
            to="/admin/products/new"
            className={buttonClasses({ size: "sm", className: "flex items-center gap-1.5 font-bold" })}
          >
            <Plus className="size-4" />
            New Product
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center bg-raised border border-line rounded-2xl">
          <Package className="size-12 text-muted mx-auto mb-3" />
          <h2 className="text-lg font-black text-fg">No products in catalogue</h2>
          <p className="text-xs text-muted mt-1 mb-6">
            Get started by adding your first roofing sheet or profile product.
          </p>
          <Link to="/admin/products/new" className={buttonClasses({ size: "sm" })}>
            Create Product
          </Link>
        </Card>
      ) : (
        <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Profile / Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Rate</TableHead>
                <TableHead>Min. Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    <div className="font-bold text-fg">{prod.name}</div>
                    <div className="text-[11px] font-mono text-muted">{prod.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge tone="accent">{prod.profileKind}</Badge>
                    <span className="text-[11px] text-muted block mt-0.5 capitalize">
                      {prod.productType}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted">
                    {prod.category?.name || "—"}
                  </TableCell>
                  <TableCell className="font-bold text-fg">
                    {formatMoney(prod.basePrice)} / {prod.unitType}
                  </TableCell>
                  <TableCell className="text-xs text-fg">
                    {prod.minOrderQuantity}
                  </TableCell>
                  <TableCell>
                    <Badge tone={prod.isActive ? "success" : "neutral"}>
                      {prod.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${prod.id}/images`}
                        className="btn-press text-xs font-bold text-accent hover:underline inline-flex items-center gap-1 p-1"
                        title="Manage Images"
                      >
                        <ImageIcon className="size-3.5" />
                        Images
                      </Link>
                      <Link
                        to={`/products/${prod.slug}`}
                        target="_blank"
                        className="btn-press text-xs text-muted hover:text-fg p-1"
                        title="View on Storefront"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}