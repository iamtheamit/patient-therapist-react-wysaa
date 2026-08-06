import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for conditionally joining Tailwind CSS class names
 * Handles merging conflicting Tailwind classes cleanly (e.g. px-2 vs px-4).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
