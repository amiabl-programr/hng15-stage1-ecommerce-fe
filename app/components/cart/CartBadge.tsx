import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "~/lib/cn";

/**
 * Presentational: takes the count, knows nothing about where it came
 * from. The cart store is frozen until the port source is available, and
 * hard-coding a `useCart()` call here would mean shipping a guess at
 * §6's persistence and migration semantics.
 *
 * When the store lands, this is the only file that changes: the caller
 * passes `getItemCount()` instead of a literal.
 */
export function CartBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  const [pop, setPop] = useState(false);
  const previous = useRef(count);

  useEffect(() => {
    if (count === previous.current) return;
    previous.current = count;
    setPop(true);
    const timer = setTimeout(() => setPop(false), 300);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <span className={cn("relative inline-flex", className)}>
      <ShoppingBag aria-hidden className="size-5" />
      {count > 0 ? (
        <span
          className={cn(
            "absolute -top-2 -right-2 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-4 font-bold text-on-accent",
            pop && "cart-badge-pop",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {count === 0 ? "Cart is empty" : `${count} items in cart`}
      </span>
    </span>
  );
}