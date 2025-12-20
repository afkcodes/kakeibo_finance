/**
 * @fileoverview Icon name mappings for category icons
 * @module @kakeibo/core/constants
 *
 * Maps icon names to their usage in categories.
 * These names correspond to Lucide icons (web) or similar icon sets (native).
 *
 * Platform: Platform-agnostic (core)
 * Note: Icon rendering is platform-specific, but icon names are shared
 */

/**
 * Icon category groupings
 */
export const iconCategories = {
  /** Food & Dining icons */
  food: ['shopping-cart', 'utensils', 'coffee', 'bike'],

  /** Housing & Utilities icons */
  housing: ['home', 'landmark', 'zap', 'droplet', 'flame', 'wifi', 'smartphone', 'wrench'],

  /** Transportation icons */
  transport: ['fuel', 'train-front', 'car', 'square-parking', 'car-front', 'shield'],

  /** Shopping icons */
  shopping: ['shirt', 'laptop', 'armchair', 'sparkles', 'gift', 'shopping-bag'],

  /** Entertainment icons */
  entertainment: ['film', 'tv', 'gamepad-2', 'book-open', 'palette', 'dumbbell', 'ticket'],

  /** Travel icons */
  travel: ['plane', 'bed', 'map'],

  /** Health & Medical icons */
  health: ['stethoscope', 'pill', 'heart-pulse', 'smile', 'eye', 'heart'],

  /** Education icons */
  education: ['graduation-cap', 'book-marked', 'pencil'],

  /** Financial icons */
  financial: ['building-2', 'credit-card', 'receipt'],

  /** Family & Kids icons */
  family: ['baby', 'blocks', 'paw-print'],

  /** Subscriptions icons */
  subscriptions: ['repeat', 'app-window'],

  /** Other/General icons */
  other: ['heart-handshake', 'more-horizontal'],

  /** Income - Employment icons */
  employment: ['briefcase', 'award', 'clock'],

  /** Income - Business icons */
  business: ['store', 'users', 'rocket'],

  /** Income - Investments icons */
  investments: ['trending-up', 'percent', 'chart-line', 'building', 'music'],

  /** Income - Other icons */
  incomeOther: ['undo-2', 'badge-percent', 'tag', 'plus-circle'],
} as const;

/**
 * All available icon names (70+ icons)
 * Flattened array of all icon names from all categories
 */
export const allIconNames = Object.values(iconCategories).flat();

/**
 * Check if an icon name is valid
 *
 * @param iconName - Icon name to validate
 * @returns True if icon name exists in our mapping
 *
 * @example
 * ```ts
 * isValidIcon('shopping-cart'); // true
 * isValidIcon('invalid-icon'); // false
 * ```
 */
export function isValidIcon(iconName: string): boolean {
  return allIconNames.includes(iconName as (typeof allIconNames)[number]);
}

/**
 * Get icons for a specific category
 *
 * @param category - Icon category name
 * @returns Array of icon names for that category
 *
 * @example
 * ```ts
 * const foodIcons = getIconsForCategory('food');
 * // Returns: ['shopping-cart', 'utensils', 'coffee', 'bike']
 * ```
 */
export function getIconsForCategory(category: keyof typeof iconCategories): readonly string[] {
  return iconCategories[category] || [];
}

/**
 * Default icon for unknown/fallback cases
 */
export const DEFAULT_ICON = 'more-horizontal';

/**
 * Popular icons for quick selection
 * Most commonly used icons across categories
 */
export const popularIcons = [
  'shopping-cart',
  'utensils',
  'coffee',
  'home',
  'car',
  'plane',
  'heart',
  'briefcase',
  'gift',
  'users',
  'trending-up',
  'credit-card',
] as const;
