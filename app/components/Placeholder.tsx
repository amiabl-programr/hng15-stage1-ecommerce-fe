import type { ReactNode } from "react";
import { Construction } from "lucide-react";

/**
 * Stand-in for a screen that has not been built yet.
 *
 * Deliberately loud. A placeholder that looks finished is worse than an
 * obvious gap, because it reads as shipped — plan.md §6 lists this as a
 * standing risk for exactly that reason.
 */
export function Placeholder({
  title,
  phase,
  children,
}: {
  title: string;
  /** What this screen will be built from, so the gap is traceable. */
  phase: string;
  children?: ReactNode;
}) {
  return (
    <div className="shell-container py-16 sm:py-24">
      <div className="border-line rounded-2xl border border-dashed p-8 sm:p-12">
        <Construction aria-hidden className="text-accent size-8" />
        <p className="eyebrow mt-6">Not built yet</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
        <p className="text-muted mt-4 max-w-prose text-sm">
          This route exists so the URL contract and its layout shell can be verified.
          Its data arrives with the API contract. Blocked on: {phase}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  );
}