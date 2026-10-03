import { type ReactNode } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "~/hooks/useFocusTrap";
import { useLockBodyScroll } from "~/hooks/useLockBodyScroll";
import { cn } from "~/lib/cn";

/** Side panel for mobile navigation and overlays below `md`. Same overlay contract as Modal. */
export function Drawer({
  open,
  onClose,
  title = "Navigation menu",
  side = "right",
  hideDefaultHeader = false,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "right" | "left";
  hideDefaultHeader?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const panelRef = useFocusTrap(open, onClose);
  useLockBodyScroll(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fade-in absolute inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer Container */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 flex w-full max-w-[340px] sm:max-w-md flex-col bg-page shadow-2xl transition-all",
          side === "right"
            ? "right-0 border-l border-line slide-left"
            : "left-0 border-r border-line slide-right",
          className
        )}
      >
        {!hideDefaultHeader && (
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
            <span className="text-sm font-black tracking-tight text-fg">{title}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="btn-press flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-raised hover:text-fg transition-colors"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}