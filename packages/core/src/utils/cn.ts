/**
 * @fileoverview Class name utility and component variants
 * @module @kakeibo/core/utils
 *
 * Provides utilities for merging CSS class names and creating component variants.
 * Uses tailwind-variants for both web (Tailwind CSS) and native (uniwind).
 *
 * Platform: Platform-agnostic (core)
 */

import { tv as tvBase, type VariantProps } from 'tailwind-variants';

/**
 * Re-export tailwind-variants utilities
 */
export { cn } from 'tailwind-variants';
export type { VariantProps };
export const tv = tvBase;

/**
 * Create component variants with tailwind-variants
 *
 * @example
 * ```ts
 * const button = tv({
 *   base: 'font-semibold rounded-lg',
 *   variants: {
 *     color: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-500 text-white',
 *     },
 *     size: {
 *       sm: 'text-sm px-3 py-1',
 *       md: 'text-base px-4 py-2',
 *       lg: 'text-lg px-6 py-3',
 *     },
 *   },
 *   defaultVariants: {
 *     color: 'primary',
 *     size: 'md',
 *   },
 * });
 *
 * button({ color: 'secondary', size: 'lg' });
 * ```
 */
