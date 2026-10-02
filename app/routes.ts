import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

/**
 * Every URL here is fixed. notes.md §3 preserves the shapes the current
 * app already publishes and the Footer deep-links to with query strings,
 * so these paths are a contract, not a naming preference.
 *
 * `layout()` adds no URL segment — it only wraps children in a shell.
 * `prefix()` is what puts "account" and "admin" in front.
 *
 * NOT YET GUARDED. notes.md §3 wraps the account and admin branches in
 * RequireAuth and RequireAdmin; those are frozen until the session
 * store exists, so both sections currently resolve for anonymous
 * visitors and render empty placeholders. See plan.md §2.
 */
export default [
  layout("routes/store.tsx", [
    index("routes/store._index.tsx"),
    route("products", "routes/store.products.tsx"),
    route("products/:slug", "routes/store.products.$slug.tsx"),
    route("categories", "routes/store.categories.tsx"),
    route("cart", "routes/store.cart.tsx"),
    route("checkout", "routes/store.checkout.tsx"),
    route("checkout/success", "routes/store.checkout.success.tsx"),
    route("fabrication", "routes/store.fabrication.tsx"),
    route("about", "routes/store.about.tsx"),
    route("login", "routes/store.login.tsx"),
  ]),

  route("account", "routes/account.tsx", [
    index("routes/account._index.tsx"),
    route("orders", "routes/account.orders.tsx"),
    route("orders/:id", "routes/account.orders.$id.tsx"),
    route("sessions", "routes/account.sessions.tsx"),
  ]),

  route("admin", "routes/admin.tsx", [
    index("routes/admin._index.tsx"),
    route("products", "routes/admin.products.tsx"),
    route("products/new", "routes/admin.products.new.tsx"),
    route("products/:id/images", "routes/admin.products.$id.images.tsx"),
    route("categories", "routes/admin.categories.tsx"),
    route("orders", "routes/admin.orders.tsx"),
    route("customers", "routes/admin.customers.tsx"),
    route("inventory", "routes/admin.inventory.tsx"),
    route("fabrication-requests", "routes/admin.fabrication-requests.tsx"),
  ]),

  route("*", "routes/$.tsx"),
] satisfies RouteConfig;