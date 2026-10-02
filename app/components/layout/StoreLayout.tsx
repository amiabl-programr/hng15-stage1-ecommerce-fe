import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ToastProvider } from "~/components/ui/Toast";

/**
 * The light storefront shell: sticky nav, content, footer.
 *
 * `shell-store` sets the palette variables that every `bg-page` /
 * `text-fg` / `border-line` in the tree resolves through. Adding it here
 * rather than on individual pages is what keeps a page from being
 * accidentally painted into the console palette.
 */
export function StoreLayout() {
  return (
    <ToastProvider>
      <div className="shell-store bg-page text-fg flex min-h-screen flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}