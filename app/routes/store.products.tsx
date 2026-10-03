import type { Route } from "./+types/store.products";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { Search, Filter, SlidersHorizontal, PackageX, RotateCcw } from "lucide-react";
import { getCategories, getProducts } from "~/lib/api/endpoints";
import { site } from "~/lib/site";
import { ProductCard } from "~/components/products/ProductCard";
import { EmptyState } from "~/components/ui/EmptyState";
import { Button } from "~/components/ui/Button";
import type { Category, Product } from "~/types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Products Catalogue — ${site.name}` },
    { name: "description", content: "Explore our range of roofing profiles, dimensioned sheets, ridges, flashings, and fasteners." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  const search = url.searchParams.get("search")?.toLowerCase().trim() || "";
  const sort = url.searchParams.get("sort") || "featured";

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts({ category, limit: 100 }),
      getCategories(),
    ]);

    let products = productsRes.items || [];

    // Client/loader side search filter if query is provided
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.slug.toLowerCase().includes(search) ||
          p.profileKind.toLowerCase().includes(search) ||
          (p.description && p.description.toLowerCase().includes(search))
      );
    }

    // Sort products
    if (sort === "price-asc") {
      products.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sort === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return {
      products,
      categories: categoriesRes.items || [],
      selectedCategory: category || "",
      searchQuery: search,
      sortOrder: sort,
    };
  } catch {
    return {
      products: [] as Product[],
      categories: [] as Category[],
      selectedCategory: "",
      searchQuery: "",
      sortOrder: "featured",
    };
  }
}

export default function CatalogPage() {
  const { products, categories, selectedCategory, searchQuery, sortOrder } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set("category", slug);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (sort && sort !== "featured") {
      newParams.set("sort", sort);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q") as string)?.trim() || "";
    const newParams = new URLSearchParams(searchParams);
    if (q) {
      newParams.set("search", q);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = !!selectedCategory || !!searchQuery || sortOrder !== "featured";

  return (
    <div className="shell-container py-10 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-1">Products</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Roofing Catalogue</h1>
        <p className="text-muted mt-2 text-sm max-w-xl">
          High-grade aluminium, aluzinc, and stone-coated roofing materials. Manufactured to exact project specifications.
        </p>
      </div>

      {/* Filter & Controls Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-line bg-raised p-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            name="q"
            defaultValue={searchQuery}
            type="search"
            placeholder="Search profiles, sheets, materials..."
            className="w-full rounded-lg border border-line bg-page py-2 pr-3 pl-9 text-sm focus:border-accent"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="rounded-lg border border-line bg-page py-2 px-3 text-xs font-bold text-fg focus:border-accent"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-line bg-page py-2 px-3 text-xs font-bold text-fg focus:border-accent"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn-press flex items-center gap-1 text-xs font-bold text-danger hover:underline px-2 py-1"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Quick Pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange("")}
          className={`btn-press rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
            !selectedCategory
              ? "bg-accent text-on-accent"
              : "border border-line bg-page text-muted hover:border-accent hover:text-fg"
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleCategoryChange(c.slug)}
            className={`btn-press rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              selectedCategory === c.slug
                ? "bg-accent text-on-accent"
                : "border border-line bg-page text-muted hover:border-accent hover:text-fg"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <EmptyState
          icon={<PackageX className="size-10" />}
          title="No products match your criteria"
          description={
            hasActiveFilters
              ? "Try adjusting your search query or selecting another category."
              : "No products are currently available in the catalogue."
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}