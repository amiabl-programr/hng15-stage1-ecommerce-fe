import type { Route } from "./+types/store._index";
import { Link, useLoaderData } from "react-router";
import { ArrowRight, HardHat, ShieldCheck, Truck, Wrench, Layers } from "lucide-react";
import { buttonClasses } from "~/components/ui/Button";
import { Reveal } from "~/components/Reveal";
import { site } from "~/lib/site";
import { getCategories, getFeaturedProducts } from "~/lib/api/endpoints";
import { ProductCard } from "~/components/products/ProductCard";
import type { Category, Product } from "~/types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${site.name} — roofing sheet, profile and fabrication` },
    {
      name: "description",
      content:
        "Roofing sheet, profile and fabrication supplied to spec, with cut-to-length and on-site roll forming.",
    },
  ];
}

export async function loader() {
  try {
    const [featuredRes, categoriesRes] = await Promise.all([
      getFeaturedProducts().catch(() => ({ success: true as const, items: [] as Product[] })),
      getCategories().catch(() => ({ success: true as const, items: [] as Category[] })),
    ]);

    return {
      featured: featuredRes.items || [],
      categories: categoriesRes.items || [],
    };
  } catch {
    return { featured: [], categories: [] };
  }
}

export default function HomePage() {
  const { featured, categories } = useLoaderData<typeof loader>();

  return (
    <>
      <section className="hero-animate border-b border-line bg-raised">
        <div className="shell-container py-20 sm:py-28">
          <p className="eyebrow">Roofing sheet &amp; fabrication</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-black">
            Profiles, sheets and fabrication, supplied to spec.
          </h1>
          <p className="text-muted mt-6 max-w-xl text-base">
            Cut to length, delivered on site, and rolled on site when the run is too
            short to ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className={buttonClasses({ size: "lg" })}>
              Browse products
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              to="/fabrication"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              Request fabrication
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="shell-container py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="eyebrow mb-1">Top Selections</p>
              <h2 className="text-2xl sm:text-3xl font-black">Featured Profiles &amp; Sheets</h2>
            </div>
            <Link
              to="/products"
              className="text-accent font-bold text-sm flex items-center gap-1 hover:underline"
            >
              View all products
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="bg-raised border-y border-line py-16">
          <div className="shell-container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow mb-1">Product Categories</p>
                <h2 className="text-2xl sm:text-3xl font-black">Browse by Specification</h2>
              </div>
              <Link
                to="/categories"
                className="text-accent font-bold text-sm flex items-center gap-1 hover:underline"
              >
                All categories
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="btn-press group rounded-xl border border-line bg-page p-5 hover:border-accent transition-all"
                >
                  <Layers className="size-6 text-accent mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-fg group-hover:text-accent">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-muted text-xs mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Reveal as="section" className="shell-container py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Warranty",
              body: "Manufacturer warranty on every profile and certified sheet grade.",
            },
            {
              icon: Truck,
              title: "Nationwide Delivery",
              body: "Scheduled direct-to-site crane offloading or collection from our yards.",
            },
            {
              icon: Wrench,
              title: "On-site roll forming",
              body: "Continuous length mobile roll forming on site to eliminate overlap leaks.",
            },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-2xl border border-line bg-page">
              <item.icon className="size-7 text-accent mb-3" />
              <h2 className="text-lg font-black">{item.title}</h2>
              <p className="text-muted mt-2 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" stagger className="bg-raised border-t border-line">
        <div className="shell-container flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <HardHat aria-hidden className="text-accent size-8" />
            <h2 className="mt-4 text-2xl font-black">Need a profile that is not listed?</h2>
            <p className="text-muted mt-2 max-w-prose text-sm">
              Send us the architectural drawings or section measurements and we will quote the custom fabrication.
            </p>
          </div>
          <Link
            to="/fabrication"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            Start a fabrication request
          </Link>
        </div>
      </Reveal>
    </>
  );
}