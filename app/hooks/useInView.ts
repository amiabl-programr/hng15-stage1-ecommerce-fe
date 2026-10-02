import { useEffect, useRef, useState } from "react";

/**
 * Report when an element scrolls into view, once.
 *
 * Drives the `is-visible` class that `.reveal` and `.reveal-stagger`
 * animate from. Note the CSS keeps those elements visible by default and
 * only hides them under `.js-reveal` — so if this hook never runs, the
 * content is still there. See the scroll-reveal block in animations.css.
 *
 * Honours `prefers-reduced-motion` by revealing immediately: there is
 * nothing to animate to, and waiting on an observer that may sit below
 * the fold would leave content hidden for no reason.
 */
export function useInView<T extends Element>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      // No observer support: show the content rather than hide it.
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}