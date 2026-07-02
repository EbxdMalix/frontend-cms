import { clsx } from "clsx";

/**
 * Merges class names. Uses clsx for conditional logic.
 * No external tailwind-merge needed — Tailwind v4 handles conflicts natively.
 */
export function cn(...inputs) {
  return clsx(inputs);
}
