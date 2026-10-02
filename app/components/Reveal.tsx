import type { ReactNode } from "react";
import { useInView } from "~/hooks/useInView";
import { cn } from "~/lib/cn";

/**
 * Scroll reveal. Adds `is-visible` once the element intersects, which is
 * what `.reveal` and `.reveal-stagger` in animations.css animate from.
 *
 * The hidden state is opt-in from `.js-reveal`, which an inline script adds
 * before first paint. So this component failing — or never running — leaves
 * content visible rather than blank.
 */
export function Reveal({
  children,
  stagger = false,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  stagger?: boolean;
  className?: string;
  as?: "div" | "section";
}) {
  const { ref, inView } = useInView<HTMLElement>();

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  return (
    <Tag
      ref={setRef}
      className={cn(
        stagger ? "reveal-stagger" : "reveal",
        inView && "is-visible",
        className,
      )}
    >
      {children}
    </Tag>
  );
}