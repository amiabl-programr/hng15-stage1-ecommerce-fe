import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "~/lib/cn";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

/**
 * Client-state tabs, following the WAI-ARIA tabs pattern: arrow keys move
 * between tabs, only the selected tab is in the tab order, and the panel
 * is associated by id rather than by position.
 */
export function Tabs({
  items,
  initial,
  className,
}: {
  items: TabItem[];
  initial?: string;
  className?: string;
}) {
  const baseId = useId();
  const [active, setActive] = useState(initial ?? items[0]?.id);
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;

    const index = items.findIndex((item) => item.id === active);
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;

    event.preventDefault();
    const id = items[next].id;
    setActive(id);
    tabsRef.current[id]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="border-line flex gap-1 overflow-x-auto border-b"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabsRef.current[item.id] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                "btn-press -mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-bold",
                selected
                  ? "border-accent text-accent"
                  : "text-muted hover:text-fg border-transparent",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="py-6 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}