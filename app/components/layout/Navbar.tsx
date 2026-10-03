import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  HardHat,
  Menu,
  X,
  Search,
  User,
  Shield,
  Layers,
  Package,
  Wrench,
  Info,
  PhoneCall,
  ShoppingBag,
  LogOut,
  ArrowRight,
  Truck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Drawer } from "~/components/ui/Drawer";
import { CartBadge } from "~/components/cart/CartBadge";
import { primaryNav, site } from "~/lib/site";
import { cn } from "~/lib/cn";
import { useCart } from "~/store/cart";
import { useAuth } from "~/store/session";

/** Quick specification chips for rapid mobile filtering on site */
const SPEC_CHIPS = [
  { label: "0.55mm AZ150", query: "0.55mm" },
  { label: "Longspan", query: "longspan" },
  { label: "Metcoppo", query: "metcoppo" },
  { label: "Step-Tile", query: "step-tile" },
  { label: "Stone-Coated", query: "stone" },
  { label: "Ridge Caps", query: "ridge" },
  { label: "Hex Screws", query: "screws" },
];

/** Architectural categories with gauge and spec cues */
const CATEGORY_ITEMS = [
  {
    title: "Industrial & Longspan",
    spec: "0.45mm – 0.70mm Box Profiles",
    to: "/products?category=industrial-sheets",
  },
  {
    title: "Residential Step-Tile & Metcoppo",
    spec: "Roman Barrel & Stepped Profiles",
    to: "/products?category=residential-steeltile",
  },
  {
    title: "Stone-Coated Shingles",
    spec: "Volcanic Basalt Granule Finish",
    to: "/products?category=stone-coated",
  },
  {
    title: "Flashings, Gutters & Trims",
    spec: "Custom Bending, Ridge & Eaves",
    to: "/products?category=flashings-gutters",
  },
  {
    title: "Fasteners & Accessories",
    spec: "Class 4 Ruspert Screws & Washers",
    to: "/products?category=fasteners-accessories",
  },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");
  const [autoFocusSearch, setAutoFocusSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (menuOpen && autoFocusSearch) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
        setAutoFocusSearch(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [menuOpen, autoFocusSearch]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "btn-press rounded-lg px-3 py-2 text-sm font-bold transition-colors",
      isActive ? "text-accent bg-accent/10" : "text-fg hover:text-accent hover:bg-raised",
    );

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setMenuOpen(false);
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const onSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    const query = typeof value === "string" ? value : "";
    handleSearchSubmit(query);
  };

  const openSearchMode = () => {
    setAutoFocusSearch(true);
    setMenuOpen(true);
  };

  return (
    <header className="bg-page/95 sticky top-0 z-40 border-b border-line backdrop-blur shadow-xs">
      <div className="shell-container">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 min-w-0"
          >
            <div className="size-9 sm:size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent">
              <HardHat aria-hidden className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-base sm:text-lg font-black tracking-tight text-fg">
                {site.name}
              </span>
              <span className="hidden sm:inline text-[10px] font-medium text-muted truncate">
                Precision Profiles &amp; Roll Forming
              </span>
            </div>
          </Link>

          {/* Desktop Primary Nav */}
          <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Search */}
          <form role="search" onSubmit={onSearchFormSubmit} className="ml-4 hidden md:block">
            <label htmlFor="nav-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search
                aria-hidden
                className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <input
                id="nav-search"
                name="q"
                type="search"
                placeholder="Search profiles, sheets, gauges..."
                className="focus:border-accent w-48 rounded-xl border border-line bg-raised/50 py-2 pr-3 pl-9 text-xs lg:w-60 font-medium focus:bg-page transition-colors"
              />
            </div>
          </form>

          {/* Actions & Mobile Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-press hidden items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-500/20 md:flex"
                title="Admin Console"
              >
                <Shield className="size-3.5" />
                Admin
              </Link>
            )}

            {/* Mobile Quick Search Button */}
            <button
              type="button"
              onClick={openSearchMode}
              aria-label="Search profiles and specifications"
              className="btn-press flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised/70 text-fg hover:bg-raised active:scale-95 md:hidden"
            >
              <Search aria-hidden className="size-4.5" />
            </button>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="btn-press relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised/70 hover:bg-raised text-fg transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <CartBadge count={itemCount} />
            </Link>

            {/* Desktop User Avatar / Account */}
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="btn-press hover:bg-raised hidden items-center gap-2 rounded-xl border border-line/60 bg-raised/40 p-2 text-sm font-medium md:flex"
              aria-label={isAuthenticated ? "My Account" : "Sign in"}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || "User Avatar"}
                  className="size-6 rounded-full object-cover border border-line"
                />
              ) : (
                <User aria-hidden className="size-5 text-muted" />
              )}
            </Link>

            {/* Mobile Navigation Toggle Button */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="btn-press flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised text-fg hover:border-accent/40 active:scale-95 lg:hidden"
              hidden={menuOpen}
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern High-Craft Mobile Navigation Sheet */}
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Store Navigation & Specifications"
        side="right"
        hideDefaultHeader
      >
        <div className="flex flex-col h-full bg-page">
          {/* Integrated Drawer Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 bg-page/80 backdrop-blur">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <HardHat className="size-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black tracking-tight text-fg truncate">
                  {site.name}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Mill &amp; Dispatch Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="btn-press flex size-9 items-center justify-center rounded-xl border border-line/70 bg-raised/80 text-fg hover:bg-raised active:scale-95 transition-colors"
            >
              <X aria-hidden className="size-4.5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Search Input & Quick Specification Chips */}
            <div className="space-y-3">
              <form role="search" onSubmit={onSearchFormSubmit} className="relative">
                <label htmlFor="drawer-search-input" className="sr-only">
                  Search profiles and sheets
                </label>
                <div className="relative">
                  <Search
                    aria-hidden
                    className="text-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
                  />
                  <input
                    ref={searchInputRef}
                    id="drawer-search-input"
                    name="q"
                    type="search"
                    value={drawerSearch}
                    onChange={(e) => setDrawerSearch(e.target.value)}
                    placeholder="Search gauge, profile, sheets..."
                    className="w-full rounded-xl border border-line bg-raised py-2.5 pr-20 pl-10 text-xs font-medium focus:border-accent focus:bg-page transition-colors"
                  />
                  <button
                    type="submit"
                    className="btn-press absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-on-accent"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* One-Tap Specification Chips */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-hidden pb-1 -mx-1 px-1 scrollbar-none">
                {SPEC_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setDrawerSearch(chip.query);
                      handleSearchSubmit(chip.query);
                    }}
                    className="btn-press shrink-0 rounded-lg border border-line bg-raised/70 px-2.5 py-1 text-[11px] font-semibold text-fg hover:border-accent hover:text-accent transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Roofing Profiles & Specifications Hub */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-muted">Roofing Specifications</span>
                <Link
                  to="/categories"
                  onClick={() => setMenuOpen(false)}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <span>All categories</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>

              <div className="grid gap-1.5">
                {CATEGORY_ITEMS.map((cat) => (
                  <Link
                    key={cat.title}
                    to={cat.to}
                    onClick={() => setMenuOpen(false)}
                    className="btn-press group flex items-center justify-between rounded-xl border border-line/60 bg-raised/40 p-3 hover:bg-raised hover:border-accent/30 transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-fg group-hover:text-accent transition-colors">
                        {cat.title}
                      </p>
                      <p className="text-[11px] text-muted truncate mt-0.5">{cat.spec}</p>
                    </div>
                    <ArrowRight className="size-3.5 text-muted/60 shrink-0 group-hover:translate-x-1 group-hover:text-accent transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile On-Site Roll-Forming Feature Card */}
            <div className="rounded-2xl border border-accent/25 bg-accent/5 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-accent">
                <Truck className="size-4 shrink-0" />
                <span className="text-xs font-black tracking-tight">
                  Mobile On-Site Roll Forming
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted">
                Need continuous seamless sheets up to 30m? We deploy our mobile roll-forming rig directly to your building site.
              </p>
              <Link
                to="/fabrication"
                onClick={() => setMenuOpen(false)}
                className="btn-press inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
              >
                <span>Request site fabrication</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Primary Navigation Links */}
            <div className="space-y-1 pt-1">
              <div className="px-1 mb-2">
                <span className="text-xs font-bold text-muted">Store Directory</span>
              </div>

              <NavLink
                to="/products"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "btn-press flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors",
                    isActive ? "text-accent bg-accent/10" : "text-fg hover:bg-raised hover:text-accent"
                  )
                }
              >
                <Package className="size-4 shrink-0 text-muted" />
                <span>All Products &amp; Prices</span>
              </NavLink>

              <NavLink
                to="/fabrication"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "btn-press flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors",
                    isActive ? "text-accent bg-accent/10" : "text-fg hover:bg-raised hover:text-accent"
                  )
                }
              >
                <Wrench className="size-4 shrink-0 text-muted" />
                <span>Custom Fabrication Specs</span>
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "btn-press flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors",
                    isActive ? "text-accent bg-accent/10" : "text-fg hover:bg-raised hover:text-accent"
                  )
                }
              >
                <Info className="size-4 shrink-0 text-muted" />
                <span>About Factory Standards</span>
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="btn-press flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 mt-2"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="size-4" />
                    <span>Admin Operations Console</span>
                  </div>
                  <ExternalLink className="size-3.5 opacity-60" />
                </NavLink>
              )}
            </div>
          </div>

          {/* Account & Direct Dispatch Footer */}
          <div className="mt-auto border-t border-line bg-raised/50 p-4 space-y-3">
            {isAuthenticated ? (
              <div className="rounded-xl border border-line bg-page p-3 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "User"}
                      className="size-8 rounded-full object-cover border border-line shrink-0"
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-fg truncate">
                      {user?.fullName || "Account"}
                    </p>
                    <p className="text-[11px] text-muted truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-line/60">
                  <Link
                    to="/account/orders"
                    onClick={() => setMenuOpen(false)}
                    className="btn-press flex-1 text-center py-1.5 rounded-lg bg-raised border border-line text-xs font-bold text-fg hover:border-accent"
                  >
                    My Orders &amp; Dispatch
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="btn-press p-1.5 rounded-lg text-danger hover:bg-danger/10"
                    title="Log out"
                    aria-label="Log out"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-press flex items-center justify-center gap-2 w-full rounded-xl bg-accent py-2.5 px-4 text-xs font-bold text-on-accent shadow-xs"
              >
                <User className="size-4" />
                <span>Sign In or Register</span>
              </Link>
            )}

            {/* Direct Engineer Dispatch Hotline */}
            <a
              href={`tel:${site.phone.replace(/\s+/g, "")}`}
              className="btn-press flex items-center justify-center gap-2 w-full rounded-xl border border-line bg-page py-2 px-3 text-xs font-medium text-fg hover:border-accent transition-colors"
            >
              <PhoneCall className="size-3.5 text-emerald-600" />
              <span>Direct Mill Dispatch: <strong>{site.phone}</strong></span>
            </a>
          </div>
        </div>
      </Drawer>
    </header>
  );
}