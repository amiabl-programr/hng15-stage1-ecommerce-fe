import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

/**
 * The empty state is an explanation plus the next action. "No data" is
 * not an empty state — it tells a visitor nothing and offers them
 * nothing to do.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-center",
        className,
      )}
    >
      {icon ? <div className="text-muted mb-4">{icon}</div> : null}
      <h2 className="text-lg">{title}</h2>
      {description ? (
        <p className="text-muted mt-2 max-w-prose text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}