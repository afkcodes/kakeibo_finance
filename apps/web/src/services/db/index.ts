/**
 * @fileoverview Web database setup (Dexie/IndexedDB)
 * @module @kakeibo/web/services/db
 *
 * Initializes Dexie database for web platform.
 *
 * Platform: Web only
 */

import type { Account, Budget, Category, Goal, Transaction, User } from '@kakeibo/core';
import Dexie, { type EntityTable } from 'dexie';

/**
 * Kakeibo Dexie database class
 */
class KakeiboDatabase extends Dexie {
  users!: EntityTable<User, 'id'>;
  accounts!: EntityTable<Account, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  transactions!: EntityTable<Transaction, 'id'>;
  budgets!: EntityTable<Budget, 'id'>;
  goals!: EntityTable<Goal, 'id'>;

  constructor() {
    super('KakeiboDB');

    // IndexedDB schema definition
    this.version(1).stores({
      users: 'id, email',
      accounts: 'id, userId, type, isActive',
      categories: 'id, userId, type, parentId, isDefault, order',
      transactions:
        'id, userId, accountId, categoryId, type, date, [userId+date], [userId+categoryId], [userId+accountId]',
      budgets: 'id, userId, categoryId, period, [userId+categoryId]',
      goals: 'id, userId, type, status, [userId+status]',
    });
  }
}

// Create and export the database instance
export const db = new KakeiboDatabase();

// Export adapter singleton
export { adapter } from './adapter';
