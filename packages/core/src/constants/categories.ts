/**
 * @fileoverview Category constants and default category definitions
 * @module @kakeibo/core/constants
 *
 * Provides default expense and income categories with colors and icons.
 * These are seeded when a new user account is created.
 *
 * Platform: Platform-agnostic (core)
 */

import type { Category } from '../types/category';

/**
 * Default expense categories (24 total)
 *
 * Organized into logical groups for comprehensive expense tracking:
 * - Food & Dining (3 categories)
 * - Housing & Utilities (2 categories)
 * - Transportation (2 categories)
 * - Shopping (2 categories)
 * - Entertainment & Leisure (3 categories)
 * - Travel (1 category)
 * - Health & Medical (2 categories)
 * - Education (1 category)
 * - Financial (2 categories)
 * - Family & Kids (2 categories)
 * - Subscriptions (1 category)
 * - Other (3 categories)
 */
export const defaultExpenseCategories: Omit<Category, 'id' | 'userId'>[] = [
  // 🍽️ Food & Dining
  {
    name: 'Groceries',
    type: 'expense',
    color: '#22c55e',
    icon: 'shopping-cart',
    isDefault: true,
    order: 1,
  },
  {
    name: 'Restaurants',
    type: 'expense',
    color: '#ef4444',
    icon: 'utensils',
    isDefault: true,
    order: 2,
  },
  {
    name: 'Coffee & Snacks',
    type: 'expense',
    color: '#f97316',
    icon: 'coffee',
    isDefault: true,
    order: 3,
  },

  // 🏠 Housing & Utilities
  { name: 'Housing', type: 'expense', color: '#06b6d4', icon: 'home', isDefault: true, order: 4 },
  { name: 'Utilities', type: 'expense', color: '#eab308', icon: 'zap', isDefault: true, order: 5 },

  // 🚗 Transportation
  { name: 'Vehicle', type: 'expense', color: '#dc2626', icon: 'car', isDefault: true, order: 6 },
  {
    name: 'Transport',
    type: 'expense',
    color: '#2563eb',
    icon: 'train-front',
    isDefault: true,
    order: 7,
  },

  // 🛍️ Shopping
  {
    name: 'Shopping',
    type: 'expense',
    color: '#ec4899',
    icon: 'shopping-bag',
    isDefault: true,
    order: 8,
  },
  {
    name: 'Electronics',
    type: 'expense',
    color: '#6366f1',
    icon: 'laptop',
    isDefault: true,
    order: 9,
  },

  // 🎬 Entertainment & Leisure
  {
    name: 'Entertainment',
    type: 'expense',
    color: '#9333ea',
    icon: 'tv',
    isDefault: true,
    order: 10,
  },
  {
    name: 'Sports & Fitness',
    type: 'expense',
    color: '#16a34a',
    icon: 'dumbbell',
    isDefault: true,
    order: 11,
  },
  {
    name: 'Hobbies',
    type: 'expense',
    color: '#db2777',
    icon: 'palette',
    isDefault: true,
    order: 12,
  },

  // ✈️ Travel
  { name: 'Travel', type: 'expense', color: '#0ea5e9', icon: 'plane', isDefault: true, order: 13 },

  // 🏥 Health & Medical
  {
    name: 'Healthcare',
    type: 'expense',
    color: '#10b981',
    icon: 'stethoscope',
    isDefault: true,
    order: 14,
  },
  {
    name: 'Personal Care',
    type: 'expense',
    color: '#f472b6',
    icon: 'sparkles',
    isDefault: true,
    order: 15,
  },

  // 📚 Education
  {
    name: 'Education',
    type: 'expense',
    color: '#4f46e5',
    icon: 'graduation-cap',
    isDefault: true,
    order: 16,
  },

  // 💰 Financial
  {
    name: 'Financial',
    type: 'expense',
    color: '#f97316',
    icon: 'landmark',
    isDefault: true,
    order: 17,
  },
  {
    name: 'Insurance',
    type: 'expense',
    color: '#94a3b8',
    icon: 'shield',
    isDefault: true,
    order: 18,
  },

  // 👶 Family
  { name: 'Family', type: 'expense', color: '#f472b6', icon: 'users', isDefault: true, order: 19 },
  {
    name: 'Pets',
    type: 'expense',
    color: '#fbbf24',
    icon: 'paw-print',
    isDefault: true,
    order: 20,
  },

  // 🔧 Subscriptions
  {
    name: 'Subscriptions',
    type: 'expense',
    color: '#a855f7',
    icon: 'repeat',
    isDefault: true,
    order: 21,
  },

  // 🎁 Other
  { name: 'Gifts', type: 'expense', color: '#e879f9', icon: 'gift', isDefault: true, order: 22 },
  {
    name: 'Charity',
    type: 'expense',
    color: '#f43f5e',
    icon: 'heart-handshake',
    isDefault: true,
    order: 23,
  },
  {
    name: 'Other',
    type: 'expense',
    color: '#a1a1aa',
    icon: 'more-horizontal',
    isDefault: true,
    order: 24,
  },
];

/**
 * Default income categories (8 total)
 *
 * Organized into logical groups:
 * - Employment (1 category)
 * - Freelance & Business (2 categories)
 * - Investments & Passive Income (2 categories)
 * - Other Income (3 categories)
 */
export const defaultIncomeCategories: Omit<Category, 'id' | 'userId'>[] = [
  // 💼 Employment
  {
    name: 'Salary',
    type: 'income',
    color: '#10b981',
    icon: 'briefcase',
    isDefault: true,
    order: 1,
  },

  // 💻 Freelance & Business
  {
    name: 'Freelance',
    type: 'income',
    color: '#06b6d4',
    icon: 'laptop',
    isDefault: true,
    order: 2,
  },
  { name: 'Business', type: 'income', color: '#0891b2', icon: 'store', isDefault: true, order: 3 },

  // 📈 Investments & Passive Income
  {
    name: 'Investments',
    type: 'income',
    color: '#8b5cf6',
    icon: 'trending-up',
    isDefault: true,
    order: 4,
  },
  {
    name: 'Rental Income',
    type: 'income',
    color: '#f59e0b',
    icon: 'building',
    isDefault: true,
    order: 5,
  },

  // 🎁 Other Income
  {
    name: 'Gifts Received',
    type: 'income',
    color: '#ec4899',
    icon: 'gift',
    isDefault: true,
    order: 6,
  },
  { name: 'Refunds', type: 'income', color: '#3b82f6', icon: 'undo-2', isDefault: true, order: 7 },
  {
    name: 'Other Income',
    type: 'income',
    color: '#a1a1aa',
    icon: 'plus-circle',
    isDefault: true,
    order: 8,
  },
];

/**
 * All default categories combined
 * Useful for seeding the database with all categories at once
 */
export const allDefaultCategories = [...defaultExpenseCategories, ...defaultIncomeCategories];
