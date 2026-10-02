import { NavLink, Outlet } from "react-router";
import { LayoutDashboard, MonitorSmartphone, ShoppingBag } from "lucide-react";
import { ToastProvider } from "~/components/ui/Toast";
import { cn } from "~/lib/cn";

const items = [
  { label: "Overview", to: "/account", icon: LayoutDashboard, end: true },
  { label: "Orders", to: "/account/orders", icon: ShoppingBag },
  { label: "Sessions", to: "/account/sessions", icon: MonitorSmartphone },
];

export function AccountLayout() {
  return (
    <ToastProvider>
      <div className="shell-console bg-page text-fg flex min-h-screen flex-col md:flex-row">
        <nav
          aria-label="Account"
          className="bg-raised border-line border-b md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-r md:border-b-0"
        >
          <p className="eyebrow px-4 pt-5 pb-3">My account</p>
          <ul className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible md:pb-0">
            {items.map(({ label, to, icon: Icon, end }) => (
              <li key={to} className="shrink-0">
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "btn-press flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold whitespace-nowrap",
                      isActive
                        ? "bg-accent text-on-accent"
                        : "text-muted hover:bg-page hover:text-fg",
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

        <main id="main" className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}