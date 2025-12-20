/**
 * @fileoverview Validation schemas barrel export
 * @module @kakeibo/core/schemas
 *
 * Central export point for all Zod validation schemas in the core package.
 * These schemas are used for form validation on both web and native platforms.
 *
 * Platform: Platform-agnostic (core)
 *
 * @example
 * ```ts
 * // Import specific schemas
 * import { createTransactionSchema, createBudgetSchema } from '@kakeibo/core/schemas';
 *
 * // Use with form libraries
 * import { zodResolver } from '@hookform/resolvers/zod';
 * const { handleSubmit } = useForm({
 *   resolver: zodResolver(createTransactionSchema),
 * });
 * ```
 */

// Account schemas
export * from './account.schema';

// Budget schemas
export * from './budget.schema';
// Category schemas
export * from './category.schema';

// Goal schemas
export * from './goal.schema';
// Transaction schemas
export * from './transaction.schema';
