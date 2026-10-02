import { NavLink } from "react-router";
import {
  Layers,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import { site } from "~/lib/site";
import { cn } from "~/lib/cn";

const items = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Layers },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Inventory", to: "/admin/inventory", icon: Warehouse },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Fabrication", to: "/admin/fabrication-requests", icon: Wrench },
];

/**
 * Full-width and stacked above the content on mobile; a fixed `md:w-64`
 * rail on desktop. No sign-out control yet — it needs a session, and a
 * button that cannot sign anyone out is worse than no button.
 */
export function AdminSidebar() {
  return (
    <nav
      aria-label="Admin"
      className="bg-raised border-line w-full shrink-0 border-b md:sticky md:top-0 md:h-screen md:w-64 md:border-r md:border-b-0"
    >
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="text-accent text-sm font-black tracking-tight">Admin</span>
        <span className="text-muted truncate text-xs">{site.name}</span>
      </div>

      <ul className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible md:pb-0">
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
    </nav>
  );
}