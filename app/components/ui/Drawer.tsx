import { type ReactNode } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "~/hooks/useFocusTrap";
import { useLockBodyScroll } from "~/hooks/useLockBodyScroll";

/** Side panel for the navbar below `md`. Same overlay contract as Modal. */
export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const panelRef = useFocusTrap(open, onClose);

  useLockBodyScroll(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="slide-right absolute inset-y-0 left-0 flex w-[320px] max-w-[88vw] flex-col border-r border-line bg-page shadow-2xl transition-all"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="text-sm font-black tracking-tight text-fg">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="btn-press -mr-2 flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-raised hover:text-fg transition-colors"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}