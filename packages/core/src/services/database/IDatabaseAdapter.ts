/**
 * @fileoverview Database adapter interface
 * @module @kakeibo/core/services/database
 *
 * Defines the platform-agnostic database adapter interface that must be
 * implemented by both web (Dexie/IndexedDB) and native (OP-SQLite) platforms.
 *
 * This interface ensures consistent database operations across platforms
 * while allowing platform-specific implementations.
 *
 * Platform: Platform-agnostic (core)
 */

import type {
  CreateAccountInput,
  CreateBudgetInput,
  CreateCategoryInput,
  CreateGoalInput,
  CreateTransactionInput,
  UpdateAccountInput,
  UpdateBudgetInput,
  UpdateCategoryInput,
  UpdateGoalInput,
  UpdateTransactionInput,
} from '../../schemas';
import type { Account } from '../../types/account';
import type { Budget } from '../../types/budget';
import type { Category } from '../../types/category';
import type { Goal } from '../../types/goal';
import type { Transaction } from '../../types/transaction';
import type { User } from '../../types/user';
import type {
  AccountFilters,
  BudgetFilters,
  CategoryFilters,
  GoalFilters,
  QueryOptions,
  TransactionFilters,
} from './types';

/**
 * Platform-agnostic database adapter interface
 *
 * Platforms must implement this interface:
 * - Web: DexieAdapter (IndexedDB via Dexie)
 * - Native: OpSqliteAdapter (SQLite via OP-SQLite)
 */
export interface IDatabaseAdapter {
  // ==================== User Operations ====================

  /**
   * Get user by ID
   *
   * @param userId - User ID
   * @returns User or undefined if not found
   */
  getUser(userId: string): Promise<User | undefined>;

  /**
   * Create a new user
   *
   * @param user - User data
   * @returns Created user
   */
  createUser(user: User): Promise<User>;

  /**
   * Update user data
   *
   * @param userId - User ID
   * @param updates - Partial user data to update
   * @returns Updated user
   */
  updateUser(userId: string, updates: Partial<User>): Promise<User>;

  /**
   * Delete user and all associated data
   *
   * @param userId - User ID
   */
  deleteUser(userId: string): Promise<void>;

  // ==================== Account Operations ====================

  /**
   * Get all accounts for a user
   *
   * @param userId - User ID
   * @param filters - Optional filters
   * @returns Array of accounts
   */
  getAccounts(userId: string, filters?: AccountFilters): Promise<Account[]>;

  /**
   * Get account by ID
   *
   * @param accountId - Account ID
   * @returns Account or undefined if not found
   */
  getAccount(accountId: string): Promise<Account | undefined>;

  /**
   * Create a new account
   *
   * @param userId - User ID
   * @param input - Account creation data
   * @returns Created account
   */
  createAccount(userId: string, input: CreateAccountInput): Promise<Account>;

  /**
   * Update account
   *
   * @param accountId - Account ID
   * @param updates - Partial account data to update
   * @returns Updated account
   */
  updateAccount(accountId: string, updates: UpdateAccountInput): Promise<Account>;

  /**
   * Delete account
   *
   * @param accountId - Account ID
   */
  deleteAccount(accountId: string): Promise<void>;

  /**
   * Update account balance
   *
   * @param accountId - Account ID
   * @param newBalance - New balance
   */
  updateAccountBalance(accountId: string, newBalance: number): Promise<void>;

  // ==================== Category Operations ====================

  /**
   * Get all categories for a user
   *
   * @param userId - User ID
   * @param filters - Optional filters
   * @returns Array of categories
   */
  getCategories(userId: string, filters?: CategoryFilters): Promise<Category[]>;

  /**
   * Get category by ID
   *
   * @param categoryId - Category ID
   * @returns Category or undefined if not found
   */
  getCategory(categoryId: string): Promise<Category | undefined>;

  /**
   * Create a new category
   *
   * @param userId - User ID
   * @param input - Category creation data
   * @returns Created category
   */
  createCategory(userId: string, input: CreateCategoryInput): Promise<Category>;

  /**
   * Update category
   *
   * @param categoryId - Category ID
   * @param updates - Partial category data to update
   * @returns Updated category
   */
  updateCategory(categoryId: string, updates: UpdateCategoryInput): Promise<Category>;

  /**
   * Delete category
   *
   * @param categoryId - Category ID
   */
  deleteCategory(categoryId: string): Promise<void>;

  // ==================== Transaction Operations ====================

  /**
   * Get all transactions for a user
   *
   * @param userId - User ID
   * @param filters - Optional filters
   * @param options - Optional query options
   * @returns Array of transactions
   */
  getTransactions(
    userId: string,
    filters?: TransactionFilters,
    options?: QueryOptions
  ): Promise<Transaction[]>;

  /**
   * Get transaction by ID
   *
   * @param transactionId - Transaction ID
   * @returns Transaction or undefined if not found
   */
  getTransaction(transactionId: string): Promise<Transaction | undefined>;

  /**
   * Create a new transaction
   *
   * Updates account balances automatically.
   * For transfers, updates both source and destination accounts.
   *
   * @param userId - User ID
   * @param input - Transaction creation data
   * @returns Created transaction
   */
  createTransaction(userId: string, input: CreateTransactionInput): Promise<Transaction>;

  /**
   * Update transaction
   *
   * Reverts old balance changes and applies new ones.
   *
   * @param transactionId - Transaction ID
   * @param updates - Partial transaction data to update
   * @returns Updated transaction
   */
  updateTransaction(transactionId: string, updates: UpdateTransactionInput): Promise<Transaction>;

  /**
   * Delete transaction
   *
   * Reverts balance changes automatically.
   *
   * @param transactionId - Transaction ID
   */
  deleteTransaction(transactionId: string): Promise<void>;

  /**
   * Get transactions for a specific account
   *
   * @param accountId - Account ID
   * @param options - Optional query options
   * @returns Array of transactions
   */
  getTransactionsByAccount(accountId: string, options?: QueryOptions): Promise<Transaction[]>;

  /**
   * Get transactions for a specific category
   *
   * @param categoryId - Category ID
   * @param options - Optional query options
   * @returns Array of transactions
   */
  getTransactionsByCategory(categoryId: string, options?: QueryOptions): Promise<Transaction[]>;

  // ==================== Budget Operations ====================

  /**
   * Get all budgets for a user
   *
   * @param userId - User ID
   * @param filters - Optional filters
   * @returns Array of budgets
   */
  getBudgets(userId: string, filters?: BudgetFilters): Promise<Budget[]>;

  /**
   * Get budget by ID
   *
   * @param budgetId - Budget ID
   * @returns Budget or undefined if not found
   */
  getBudget(budgetId: string): Promise<Budget | undefined>;

  /**
   * Create a new budget
   *
   * @param userId - User ID
   * @param input - Budget creation data
   * @returns Created budget
   */
  createBudget(userId: string, input: CreateBudgetInput): Promise<Budget>;

  /**
   * Update budget
   *
   * @param budgetId - Budget ID
   * @param updates - Partial budget data to update
   * @returns Updated budget
   */
  updateBudget(budgetId: string, updates: UpdateBudgetInput): Promise<Budget>;

  /**
   * Delete budget
   *
   * @param budgetId - Budget ID
   */
  deleteBudget(budgetId: string): Promise<void>;

  /**
   * Update budget spent amount (cached field for performance)
   *
   * @param budgetId - Budget ID
   * @param spent - New spent amount
   */
  updateBudgetSpent(budgetId: string, spent: number): Promise<void>;

  // ==================== Goal Operations ====================

  /**
   * Get all goals for a user
   *
   * @param userId - User ID
   * @param filters - Optional filters
   * @returns Array of goals
   */
  getGoals(userId: string, filters?: GoalFilters): Promise<Goal[]>;

  /**
   * Get goal by ID
   *
   * @param goalId - Goal ID
   * @returns Goal or undefined if not found
   */
  getGoal(goalId: string): Promise<Goal | undefined>;

  /**
   * Create a new goal
   *
   * @param userId - User ID
   * @param input - Goal creation data
   * @returns Created goal
   */
  createGoal(userId: string, input: CreateGoalInput): Promise<Goal>;

  /**
   * Update goal
   *
   * @param goalId - Goal ID
   * @param updates - Partial goal data to update
   * @returns Updated goal
   */
  updateGoal(goalId: string, updates: UpdateGoalInput): Promise<Goal>;

  /**
   * Delete goal
   *
   * @param goalId - Goal ID
   */
  deleteGoal(goalId: string): Promise<void>;

  /**
   * Update goal current amount
   *
   * @param goalId - Goal ID
   * @param amount - New current amount
   */
  updateGoalAmount(goalId: string, amount: number): Promise<void>;

  /**
   * Contribute to a goal (adds to current amount and creates transaction)
   *
   * @param goalId - Goal ID
   * @param amount - Amount to contribute
   * @param accountId - Account to deduct from
   * @param description - Optional transaction description
   * @returns Created transaction
   */
  contributeToGoal(
    goalId: string,
    amount: number,
    accountId: string,
    description?: string
  ): Promise<Transaction>;

  /**
   * Withdraw from a goal (subtracts from current amount and creates transaction)
   *
   * @param goalId - Goal ID
   * @param amount - Amount to withdraw
   * @param accountId - Account to credit to
   * @param description - Optional transaction description
   * @returns Created transaction
   */
  withdrawFromGoal(
    goalId: string,
    amount: number,
    accountId: string,
    description?: string
  ): Promise<Transaction>;

  // ==================== Backup & Restore ====================

  /**
   * Export entire database to JSON
   *
   * @param userId - User ID (optional, exports all if not provided)
   * @returns Export data as JSON string
   */
  exportDatabase(userId?: string): Promise<string>;

  /**
   * Import database from JSON
   *
   * Handles user ID remapping and category ID normalization.
   *
   * @param jsonData - JSON string with export data
   * @param targetUserId - Target user ID for import
   */
  importDatabase(jsonData: string, targetUserId?: string): Promise<void>;

  /**
   * Clear entire database
   *
   * ⚠️ WARNING: This deletes ALL data. Use with caution.
   */
  clearDatabase(): Promise<void>;

  // ==================== Utility Operations ====================

  /**
   * Calculate total balance across all accounts
   *
   * @param userId - User ID
   * @param excludeInactive - Exclude inactive accounts
   * @returns Total balance
   */
  getTotalBalance(userId: string, excludeInactive?: boolean): Promise<number>;

  /**
   * Get net worth (assets - liabilities)
   *
   * @param userId - User ID
   * @returns Net worth
   */
  getNetWorth(userId: string): Promise<number>;

  /**
   * Get transaction count for a user
   *
   * @param userId - User ID
   * @param filters - Optional filters
   * @returns Transaction count
   */
  getTransactionCount(userId: string, filters?: TransactionFilters): Promise<number>;

  // ==================== Data Migration ====================

  /**
   * Migrate all data from guest user to authenticated user
   *
   * Transfers:
   * - Transactions (updates userId)
   * - Budgets (updates userId)
   * - Goals (updates userId)
   * - Accounts (updates userId)
   * - Categories (updates userId, except default categories)
   *
   * @param fromGuestUserId - Source guest user ID
   * @param toAuthUserId - Target authenticated user ID
   * @returns Migration result with counts
   */
  migrateGuestDataToUser(
    fromGuestUserId: string,
    toAuthUserId: string
  ): Promise<{
    success: boolean;
    migratedCounts: {
      transactions: number;
      budgets: number;
      goals: number;
      accounts: number;
      categories: number;
    };
    error?: string;
  }>;
}
