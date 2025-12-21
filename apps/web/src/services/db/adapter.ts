/**
 * @fileoverview Singleton adapter instance for web platform
 * @module @kakeibo/web/services
 */

import { DexieAdapter } from './DexieAdapter';

/**
 * Singleton DexieAdapter instance
 * Used by all hooks for database operations
 */
export const adapter = new DexieAdapter();
