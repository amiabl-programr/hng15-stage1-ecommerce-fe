import { NavLink, Link, useNavigate } from "react-router";
import {
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import { site } from "~/lib/site";
import { cn } from "~/lib/cn";
import { useAuth } from "~/store/session";

const items = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Layers },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Inventory", to: "/admin/inventory", icon: Warehouse },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Fabrication", to: "/admin/fabrication-requests", icon: Wrench },
];

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      aria-label="Admin"
      className="bg-raised border-line flex w-full shrink-0 flex-col border-b md:sticky md:top-0 md:h-screen md:w-64 md:border-r md:border-b-0"
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm font-black tracking-tight">Admin</span>
          <span className="text-muted truncate text-xs">{site.name}</span>
        </div>
        <Link
          to="/"
          className="text-muted hover:text-fg text-xs flex items-center gap-1 font-bold"
          title="Back to Storefront"
        >
          <Store className="size-3.5" />
          Store
        </Link>
      </div>

      <ul className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
        {items.map(({ label, to, icon: Icon, end }) => (
          <li key={to} className="shrink-0 md:shrink">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "btn-press flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold whitespace-nowrap",
                  isActive ? "bg-accent text-on-accent" : "text-muted hover:bg-page hover:text-fg",
                )
              }
            >
              <Icon aria-hidden className="size-4 shrink-0" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {user && (
        <div className="hidden border-t border-line p-3 md:block">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName || "Admin"}
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <div className="size-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                {user.fullName?.[0] || "A"}
              </div>
            )}
            <div className="truncate text-xs">
              <p className="font-bold text-fg truncate">{user.fullName || "Admin"}</p>
              <p className="text-muted truncate">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="btn-press flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-danger hover:bg-page"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}