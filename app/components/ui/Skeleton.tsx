import { cn } from "~/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "promo-shimmer rounded-lg bg-raised bg-[length:200%_100%]",
        "motion-reduce:animate-none",
        className,
      )}
    />
  );
}

/** Matches the ProductCard silhouette so the grid does not reflow on load. */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-line bg-page p-4">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-4 h-5 w-1/3" />
    </div>
  );
}

export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}