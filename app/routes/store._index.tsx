import type { Route } from "./+types/store._index";
import { Link, useLoaderData } from "react-router";
import {
  ArrowRight,
  HardHat,
  ShieldCheck,
  Truck,
  Wrench,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";
import { buttonClasses } from "~/components/ui/Button";
import { Reveal } from "~/components/Reveal";
import { site } from "~/lib/site";
import { getCategories, getFeaturedProducts } from "~/lib/api/endpoints";
import { ProductCard } from "~/components/products/ProductCard";
import { ProductMedia } from "~/components/products/ProductMedia";
import type { Category, Product } from "~/types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${site.name} — Roofing Sheet, Profile & Fabrication` },
    {
      name: "description",
      content:
        "High-grade roofing sheet, architectural profiles, and mobile on-site roll forming supplied to exact engineering spec.",
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
      {/* Centralized Hero Section with Visual Showcase */}
      <section className="hero-animate border-b border-line bg-gradient-to-b from-raised via-page to-raised relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 size-[640px] rounded-full bg-accent/5 blur-3xl pointer-events-none"
        />

        <div className="shell-container py-14 sm:py-20 lg:py-24 text-center flex flex-col items-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent shadow-xs mb-6">
            <HardHat className="size-3.5 shrink-0" />
            <span>Certified Heavy-Gauge Roofing &amp; On-Site Roll Forming</span>
          </div>

          {/* Centralized Headline */}
          <h1 className="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-fg text-balance mx-auto">
            Profiles, Sheets &amp; Fabrication, Engineered to Exact Spec.
          </h1>

          {/* Subtitle */}
          <p className="text-muted mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed mx-auto text-balance">
            Cut to precision lengths, delivered directly to site nationwide, or roll-formed on-site
            for continuous seamless roofs with zero overlap leaks.
          </p>

          {/* Centralized Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/products"
              className={buttonClasses({
                size: "lg",
                className: "px-6 py-3.5 font-bold shadow-md shadow-accent/15",
              })}
            >
              Browse Products Catalogue
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              to="/fabrication"
              className={buttonClasses({
                variant: "secondary",
                size: "lg",
                className: "px-6 py-3.5 font-bold",
              })}
            >
              Request On-Site Roll Forming
            </Link>
          </div>

          {/* Trust Highlights Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>AZ150 Certified Anti-Rust</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="size-4 text-accent" />
              <span>0.55mm Heavy Gauge</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="size-4 text-accent" />
              <span>Prompt Nationwide Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-emerald-600" />
              <span>24–48hr Mill Dispatch</span>
            </div>
          </div>

          {/* Hero Visual Showcase Panel */}
          <div className="mt-12 w-full max-w-5xl rounded-3xl border border-line bg-page p-2 sm:p-3 shadow-xl overflow-hidden">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                alt="Modern architectural home featuring premium steeltile roof"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Showcase Overlays */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white border border-white/10 shadow-lg">
                  <Sparkles className="size-3.5 text-amber-400" />
                  Direct Factory Mill Pricing
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
                <div>
                  <p className="text-white text-base sm:text-xl font-black">
                    Industrial Longspan &bull; Metcoppo &bull; Stone-Coated Shingles
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-lg">
                    Guaranteed gauge thickness, custom lengths up to 30 metres, and complete fitting accessories.
                  </p>
                </div>
                <Link
                  to="/categories"
                  className="self-start sm:self-auto rounded-xl bg-white text-slate-950 px-4 py-2 text-xs font-black hover:bg-slate-100 transition-colors shrink-0"
                >
                  Explore Profiles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="shell-container py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow mb-1">Top Selections</p>
              <h2 className="text-2xl sm:text-3xl font-black">Featured Profiles &amp; Sheets</h2>
              <p className="text-muted text-xs sm:text-sm mt-1">
                Engineered for maximum structural span, weather sealing, and heat reflection.
              </p>
            </div>
            <Link
              to="/products"
              className="text-accent font-bold text-sm flex items-center gap-1.5 hover:underline"
            >
              <span>View full catalogue</span>
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

      {/* Categories Grid with Rich Imagery */}
      {categories.length > 0 && (
        <section className="bg-raised border-y border-line py-16 sm:py-20">
          <div className="shell-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="eyebrow mb-1">Product Categories</p>
                <h2 className="text-2xl sm:text-3xl font-black">Browse by Specification</h2>
                <p className="text-muted text-xs sm:text-sm mt-1">
                  Choose the exact gauge, stone finish, or industrial profile for your site.
                </p>
              </div>
              <Link
                to="/categories"
                className="text-accent font-bold text-sm flex items-center gap-1.5 hover:underline"
              >
                <span>All categories</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => {
                const imgUrl = cat.media?.[0]?.url;
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className="group flex flex-col rounded-2xl border border-line bg-page overflow-hidden product-card-shadow transition-all duration-200 hover:-translate-y-1 hover:border-accent/40"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-raised">
                          <Layers className="size-8 text-accent/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-black text-fg text-base group-hover:text-accent transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-muted text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                      <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-bold text-accent">
                        <span>View items</span>
                        <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Apex Section */}
      <Reveal as="section" className="shell-container py-16 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="eyebrow mb-1">Direct Mill Advantage</p>
          <h2 className="text-2xl sm:text-3xl font-black">Built for Coastal Durability</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "50-Year Warranty",
              body: "Anti-corrosion certified AZ150 zinc-aluminium alloy engineered for high-humidity coastal and industrial atmospheres.",
            },
            {
              icon: Truck,
              title: "Nationwide Crane Logistics",
              body: "Specialized long-bed crane trucks offload directly to your roof trusses or ground staging without bend distortion.",
            },
            {
              icon: Wrench,
              title: "Mobile On-Site Roll Forming",
              body: "Continuous length mobile forming mills roll seamless single sheets up to 30 metres directly on your construction site.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 sm:p-7 rounded-2xl border border-line bg-page product-card-shadow hover:border-accent/30 transition-colors"
            >
              <div className="size-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <item.icon className="size-6 text-accent" />
              </div>
              <h3 className="text-lg font-black text-fg">{item.title}</h3>
              <p className="text-muted mt-2 text-xs sm:text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Fabrication Banner with Lively Imagery */}
      <Reveal as="section" stagger className="bg-raised border-t border-line">
        <div className="shell-container py-14 sm:py-16">
          <div className="rounded-3xl border border-line bg-page overflow-hidden shadow-lg grid md:grid-cols-12 items-center">
            <div className="p-8 sm:p-12 md:col-span-7 space-y-4">
              <div className="size-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <HardHat aria-hidden className="text-accent size-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-fg">
                Need a Custom Profile or Continuous Length?
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-lg">
                Submit your structural drawings or required roof lengths. Our engineering yard cuts bespoke flashings, gutters, and on-site rolls within 48 hours.
              </p>
              <div className="pt-2">
                <Link
                  to="/fabrication"
                  className={buttonClasses({
                    size: "lg",
                    className: "px-6 py-3 font-bold",
                  })}
                >
                  Start Custom Fabrication Request
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 aspect-[4/3] md:h-full relative overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
                alt="Industrial metal sheet fabrication workshop"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-page/80 md:from-page/90 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}