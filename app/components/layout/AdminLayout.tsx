import { Outlet } from "react-router";
import { AdminSidebar } from "./AdminSidebar";
import { ToastProvider } from "~/components/ui/Toast";

/**
 * The dark operations console. Deliberately not the storefront palette —
 * notes.md §4 is explicit that the two should not be unified, and the
 * split is what makes the admin surface read as a different tool.
 */
export function AdminLayout() {
  return (
    <ToastProvider>
      <div className="shell-console bg-page text-fg flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <main id="main" className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}