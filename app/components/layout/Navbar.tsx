import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  HardHat,
  Menu,
  Search,
  User,
  Shield,
  Home,
  Layers,
  Package,
  Wrench,
  Info,
  PhoneCall,
  ShoppingBag,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Drawer } from "~/components/ui/Drawer";
import { CartBadge } from "~/components/cart/CartBadge";
import { primaryNav, site } from "~/lib/site";
import { cn } from "~/lib/cn";
import { useCart } from "~/store/cart";
import { useAuth } from "~/store/session";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "btn-press rounded-lg px-3 py-2 text-sm font-bold transition-colors",
      isActive ? "text-accent bg-accent/10" : "text-fg hover:text-accent hover:bg-raised",
    );

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    const query = typeof value === "string" ? value.trim() : "";
    if (!query) return;
    setMenuOpen(false);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const getNavIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home":
        return <Home className="size-4 shrink-0" />;
      case "categories":
        return <Layers className="size-4 shrink-0" />;
      case "products":
        return <Package className="size-4 shrink-0" />;
      case "fabrication":
        return <Wrench className="size-4 shrink-0" />;
      case "about":
        return <Info className="size-4 shrink-0" />;
      default:
        return <Package className="size-4 shrink-0" />;
    }
  };

  return (
    <header className="bg-page/95 sticky top-0 z-40 border-b border-line backdrop-blur shadow-xs">
      <div className="shell-container">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-base sm:text-lg font-black tracking-tight min-w-0"
          >
            <div className="size-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <HardHat aria-hidden className="text-accent size-5" />
            </div>
            <span className="truncate text-fg font-black">
              {site.name}
            </span>
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
          <form role="search" onSubmit={onSearch} className="ml-4 hidden md:block">
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
                placeholder="Search profiles, sheets..."
                className="focus:border-accent w-44 rounded-xl border border-line bg-raised/50 py-2 pr-3 pl-9 text-xs lg:w-56 font-medium focus:bg-page transition-colors"
              />
            </div>
          </form>

          {/* Actions & Mobile Toggle */}
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

            <Link
              to="/cart"
              className="btn-press relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised/60 hover:bg-raised text-fg transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <CartBadge count={itemCount} />
            </Link>

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

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="btn-press flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised/80 text-fg hover:bg-raised active:scale-95 md:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Drawer */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Navigation">
        <div className="flex flex-col h-full space-y-5 pb-6">
          {/* Brand & Quick Actions */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-raised border border-line/70">
            <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <HardHat className="size-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-black text-fg truncate">{site.name}</h3>
              <p className="text-[11px] text-muted truncate">Factory-direct roofing solutions</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="btn-press flex items-center justify-between p-3 rounded-xl border border-line bg-page hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-accent" />
                <span className="text-xs font-bold text-fg">Cart</span>
              </div>
              <span className="text-xs font-black bg-accent text-on-accent px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            </Link>

            <a
              href={`tel:${site.phone.replace(/\s+/g, "")}`}
              className="btn-press flex items-center gap-2 p-3 rounded-xl border border-line bg-page hover:border-accent transition-colors"
            >
              <PhoneCall className="size-4 text-emerald-600" />
              <span className="text-xs font-bold text-fg">Call Us</span>
            </a>
          </div>

          {/* Mobile Search Input */}
          <form role="search" onSubmit={onSearch} className="relative">
            <label htmlFor="drawer-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search
                aria-hidden
                className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <input
                id="drawer-search"
                name="q"
                type="search"
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                placeholder="Search profiles, sheets, screws..."
                className="w-full rounded-xl border border-line bg-raised py-2.5 pr-14 pl-9 text-xs font-medium focus:border-accent focus:bg-page transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-accent px-2 py-1 text-[11px] font-bold text-on-accent"
              >
                Go
              </button>
            </div>
          </form>

          {/* Main Navigation Links */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-wider text-muted uppercase px-1 mb-1">
              Store Menu
            </p>
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "btn-press flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition-all",
                    isActive
                      ? "text-accent bg-accent/10 border-l-4 border-accent pl-2.5"
                      : "text-fg hover:bg-raised hover:text-accent",
                  )
                }
              >
                <div className="flex items-center gap-3">
                  {getNavIcon(item.label)}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="size-4 text-muted/60" />
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="btn-press flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20"
              >
                <div className="flex items-center gap-3">
                  <Shield className="size-4" />
                  <span>Admin Console</span>
                </div>
                <ChevronRight className="size-4 text-amber-500/60" />
              </NavLink>
            )}
          </div>

          {/* Account & Orders Section */}
          <div className="mt-auto pt-4 border-t border-line space-y-2">
            <p className="text-[11px] font-bold tracking-wider text-muted uppercase px-1">
              Account
            </p>

            {isAuthenticated ? (
              <div className="rounded-xl border border-line bg-raised p-3 space-y-3">
                <div className="flex items-center gap-2.5">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "User"}
                      className="size-8 rounded-full object-cover border border-line"
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-fg truncate">{user?.fullName || "Account"}</p>
                    <p className="text-[11px] text-muted truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-line/60">
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-1.5 rounded-lg bg-page border border-line text-xs font-bold text-fg hover:border-accent"
                  >
                    My Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-danger hover:bg-danger/10"
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

            <div className="pt-2 text-[11px] text-muted text-center">
              <span>Direct Mill Orders &bull; {site.phone}</span>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
}