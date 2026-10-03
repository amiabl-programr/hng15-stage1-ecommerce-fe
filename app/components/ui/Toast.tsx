import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { cn } from "~/lib/cn";

export type ToastTone = "info" | "success" | "error";

export type Toast = {
  id: number;
  tone: ToastTone;
  message: string;
};

type ToastContextValue = {
  toasts: Toast[];
  notify: (message: string, tone?: ToastTone) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "info") => {
      const id = nextId++;
      setToasts((current) => [...current, { id, tone, message }]);
    },
    [],
  );

  const value = useMemo(
    () => ({ toasts, notify, dismiss }),
    [toasts, notify, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside a ToastProvider");
  return context;
}

export function useOptionalToast() {
  return useContext(ToastContext);
}

const TONE_STYLES: Record<ToastTone, string> = {
  info: "border-line",
  success: "border-emerald-500/40",
  error: "border-red-500/40",
};

/**
 * `aria-live="polite"` so a toast is announced without interrupting.
 * Errors share the same region: a failed optimistic update still needs
 * telling, and a second live region competing with this one is worse
 * than a slightly late announcement.
 */
function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pop pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-page px-4 py-3 shadow-lg",
            TONE_STYLES[toast.tone],
          )}
        >
          {toast.tone === "error" ? (
            <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-red-500" />
          ) : (
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-500" />
          )}
          <p className="min-w-0 flex-1 text-sm">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="btn-press rounded p-1 text-muted hover:text-fg"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}