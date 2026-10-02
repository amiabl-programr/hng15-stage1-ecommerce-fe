import { useEffect } from "react";

/**
 * Freeze background scrolling while an overlay is open, without the
 * layout shifting as the scrollbar disappears.
 *
 * Reference-counted, so two overlapping overlays (a modal opened from
 * inside a drawer) do not release the lock when the first one closes.
 */
let lockCount = 0;
let restoreStyles: { overflow: string; paddingRight: string } | null = null;

function lock() {
  if (typeof document === "undefined") return;
  if (lockCount === 0) {
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    restoreStyles = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
  }
  lockCount += 1;
}

function unlock() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && restoreStyles) {
    document.body.style.overflow = restoreStyles.overflow;
    document.body.style.paddingRight = restoreStyles.paddingRight;
    restoreStyles = null;
  }
}

export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}