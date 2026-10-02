/**
 * Site-wide constants.
 *
 * The business name, email and phone are unresolved — notes.md §8 asks
 * for a contact block but the brief never states the values, and the
 * category slugs it wants in the footer come from an API contract that
 * has not landed. Everything below that is marked PLACEHOLDER should be
 * replaced with real values before this ships; keeping them in one file
 * means that is a single edit rather than a sweep.
 */

export const site = {
  name: "Roofing Construction Shop",
  tagline: "Roofing sheet, profile and fabrication, supplied to spec.",
  email: "hello@example.com", // PLACEHOLDER
  phone: "+234 000 000 0000", // PLACEHOLDER
  address: "Lagos, Nigeria", // PLACEHOLDER
} as const;

export type NavItem = { label: string; to: string };

/** Storefront primary navigation, in order. */
export const primaryNav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products", to: "/products" },
  { label: "Fabrication", to: "/fabrication" },
  { label: "About", to: "/about" },
];

export const servicesNav: NavItem[] = [
  { label: "Fabrication", to: "/fabrication" },
  { label: "Cut to length", to: "/fabrication" },
  { label: "On-site roll forming", to: "/fabrication" },
];

export const companyNav: NavItem[] = [
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/about#contact" },
];

export const accountNav: NavItem[] = [
  { label: "Sign in", to: "/login" },
  { label: "My orders", to: "/account/orders" },
  { label: "Admin portal", to: "/admin" },
];

/**
 * Category deep links belong here — `?category=<slug>` — once the
 * catalogue endpoint returns them. Hard-coding slugs now would bake in
 * guesses that silently 404 the moment a slug differs.
 */
export const categoryNav: NavItem[] = [];