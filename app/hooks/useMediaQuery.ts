import { useEffect, useState } from "react";

/**
 * Subscribe to a media query, SSR-safe.
 *
 * Returns `false` on the server and on the first client render, then
 * settles to the real value in an effect. Layouts that branch on this
 * must therefore render the `false` branch on the server — the same
 * markup both sides — or hydration breaks.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}