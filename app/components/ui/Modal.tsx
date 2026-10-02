import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "~/hooks/useFocusTrap";
import { useLockBodyScroll } from "~/hooks/useLockBodyScroll";
import { cn } from "~/lib/cn";

/**
 * Rendered inline rather than through a portal: it is `fixed`, so the
 * stacking context does not matter, and skipping the portal keeps the
 * server and client markup identical instead of diverging on mount.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const panelRef = useFocusTrap(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  useLockBodyScroll(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "slide-right relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-page shadow-xl sm:rounded-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId} className="text-lg">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-muted mt-1 text-sm">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="btn-press hover:bg-raised hover:text-fg text-muted -mr-1 rounded-lg p-2"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer ? (
          <div className="flex justify-end gap-3 border-t border-line px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}