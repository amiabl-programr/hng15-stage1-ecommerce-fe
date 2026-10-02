import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "~/lib/cn";

export type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
};

/**
 * Label, control, error and hint, wired together.
 *
 * Deliberately render-prop rather than react-hook-form-aware: forms are
 * frozen until the API contract lands, and a plain `id` contract keeps
 * this reusable from RHF, a hand-rolled form, or a test with no form
 * library at all.
 *
 * The control receives `aria-invalid` and `aria-describedby` so the
 * message is announced, not just coloured.
 */
export function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-bold">
        {label}
        {required ? (
          <span aria-hidden className="text-red-500">
            {" "}
            *
          </span>
        ) : null}
      </label>

      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}

      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-xs font-bold text-red-500">
          <AlertTriangle aria-hidden className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}