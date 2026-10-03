import type { Route } from "./+types/store.categories";
import { Link, useLoaderData } from "react-router";
import { ArrowRight, Layers, Package } from "lucide-react";
import { getCategories } from "~/lib/api/endpoints";
import { site } from "~/lib/site";
import { ProductMedia } from "~/components/products/ProductMedia";
import { EmptyState } from "~/components/ui/EmptyState";
import { buttonClasses } from "~/components/ui/Button";
import type { Category } from "~/types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Categories — ${site.name}` },
    { name: "description", content: "Browse roofing profiles, sheets, gutters, and accessories by category." },
  ];
}

export async function loader() {
  try {
    const res = await getCategories();
    return { categories: res.items || [] };
  } catch {
    return { categories: [] as Category[] };
  }
}

export default function CategoriesPage() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <div className="shell-container py-12 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Catalogue</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Product Categories</h1>
        <p className="text-muted mt-2 text-sm">
          Explore our range of industrial, residential, and custom fabricated roofing profiles.
        </p>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={<Layers className="size-10" />}
          title="No categories found"
          description="Categories are currently being updated in the catalogue."
          action={
            <Link to="/products" className={buttonClasses({ size: "lg" })}>
              View all products
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-page overflow-hidden product-card-shadow transition-all hover:-translate-y-1"
            >
              {category.media && category.media.length > 0 ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <ProductMedia
                    media={category.media}
                    productName={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-raised flex items-center justify-center border-b border-line">
                  <Layers className="size-10 text-accent/50" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-fg group-hover:text-accent transition-colors">
                    {category.name}
                  </h2>
                  <ArrowRight className="size-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
                {category.description && (
                  <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-line/60 flex items-center gap-1.5 text-xs font-bold text-accent">
                  <span>Browse {category.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}