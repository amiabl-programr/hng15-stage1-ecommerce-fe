import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting later Tailwind utilities win over earlier
 * conflicting ones. `twMerge` is what makes a `className` prop able to
 * override a component's own padding; plain `clsx` would emit both and
 * leave the winner up to stylesheet order.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}