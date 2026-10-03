import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { HardHat, Menu, Search, User, Shield } from "lucide-react";
import { Drawer } from "~/components/ui/Drawer";
import { CartBadge } from "~/components/cart/CartBadge";
import { primaryNav, site } from "~/lib/site";
import { cn } from "~/lib/cn";
import { useCart } from "~/store/cart";
import { useAuth } from "~/store/session";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "btn-press rounded-lg px-3 py-2 text-sm font-bold",
      isActive ? "text-accent" : "text-fg hover:text-accent",
    );

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    const query = typeof value === "string" ? value.trim() : "";
    if (!query) return;
    setMenuOpen(false);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-page/95 sticky top-0 z-40 border-b border-line backdrop-blur">
      <div className="shell-container">
        <div className="flex h-16 items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-black tracking-tight"
          >
            <HardHat aria-hidden className="text-accent size-6" />
            <span>{site.name}</span>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <form role="search" onSubmit={onSearch} className="ml-auto hidden md:block">
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
                placeholder="Search products"
                className="focus:border-accent w-44 rounded-lg border border-line bg-page py-2 pr-3 pl-9 text-sm lg:w-56"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-press hidden items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-500/20 md:flex"
                title="Admin Console"
              >
                <Shield className="size-3.5" />
                Admin
              </Link>
            )}

            <Link
              to="/cart"
              className="btn-press hover:bg-raised rounded-lg p-2"
              aria-label="Cart"
            >
              <CartBadge count={itemCount} />
            </Link>

            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="btn-press hover:bg-raised hidden items-center gap-2 rounded-lg p-2 text-sm font-medium md:flex"
              aria-label={isAuthenticated ? "My Account" : "Sign in"}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || "User Avatar"}
                  className="size-6 rounded-full object-cover border border-line"
                />
              ) : (
                <User aria-hidden className="size-5" />
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="btn-press hover:bg-raised rounded-lg p-2 md:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <nav aria-label="Mobile" className="space-y-1">
          {primaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "btn-press block rounded-lg px-3 py-3 text-sm font-bold",
                  isActive ? "text-accent bg-raised" : "text-fg",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="btn-press block rounded-lg px-3 py-3 text-sm font-bold text-amber-600 bg-amber-500/10"
            >
              Admin Console
            </NavLink>
          )}
        </nav>

        <form role="search" onSubmit={onSearch} className="mt-4">
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
              placeholder="Search products"
              className="focus:border-accent w-full rounded-lg border border-line bg-page py-3 pr-3 pl-9 text-sm"
            />
          </div>
        </form>

        <div className="mt-4 border-t border-line pt-4">
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            onClick={() => setMenuOpen(false)}
            className="btn-press flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-bold"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName || "User Avatar"}
                className="size-5 rounded-full object-cover"
              />
            ) : (
              <User aria-hidden className="size-4" />
            )}
            {isAuthenticated ? (user?.fullName || "Account") : "Sign in"}
          </Link>
        </div>
      </Drawer>
    </header>
  );
}