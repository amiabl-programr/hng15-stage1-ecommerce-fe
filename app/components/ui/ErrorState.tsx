import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { cn } from "~/lib/cn";

/**
 * What failed, and a way to try again. Never a bare "Something went
 * wrong" — a visitor who cannot tell what broke cannot trust the page
 * around it either.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-12 text-center",
        className,
      )}
    >
      <AlertTriangle aria-hidden className="mb-4 size-8 text-red-500" />
      <h2 className="text-lg">{title}</h2>
      {message ? <p className="mt-2 max-w-prose text-sm text-muted">{message}</p> : null}
      {onRetry ? (
        <Button onClick={onRetry} variant="secondary" className="mt-6">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}