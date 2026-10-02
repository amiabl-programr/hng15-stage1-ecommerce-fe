import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
];

/**
 * Runs before first paint, so `.reveal` elements can start hidden without
 * the content ever being invisible to anything that does not run scripts.
 * See the scroll-reveal block in animations.css for why the hidden state
 * has to be opt-in rather than the default.
 */
const REVEAL_BOOT = "document.documentElement.classList.add('js-reveal')";

export function Layout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning below: the script above adds a class to <html>
  // before React hydrates. That is intentional, not a mismatch to fix.
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went wrong";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="bg-page text-fg flex min-h-screen items-center justify-center p-6">
      <div className="max-w-form text-center">
        <p className="eyebrow mb-3">{message}</p>
        <h1 className="text-3xl sm:text-4xl">{details}</h1>
        <a
          href="/"
          className="text-accent mt-8 inline-block font-bold hover:underline"
        >
          Back to the storefront
        </a>
      </div>
    </main>
  );
}