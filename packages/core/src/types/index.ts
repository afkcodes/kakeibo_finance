/**
 * @fileoverview Type definitions barrel export
 * @module @kakeibo/core/types
 *
 * Central export point for all type definitions in the core package.
 * Import types from here rather than individual files for cleaner imports.
 *
 * Platform: Platform-agnostic (core)
 *
 * @example
 * ```ts
 * // ✅ Good - import from barrel
 * import { Transaction, Budget, Account } from '@kakeibo/core/types';
 *
 * // ❌ Avoid - importing from individual files
 * import { Transaction } from '@kakeibo/core/types/transaction';
 * ```
 */

// Re-export all types from individual modules
export * from './account';
export * from './auth';
export * from './budget';
export * from './category';
export * from './goal';
export * from './subcategory';
export * from './transaction';
export * from './user';
