/**
 * @fileoverview Dexie database adapter for web platform
 * @module @kakeibo/web/services/db
 *
 * Implements IDatabaseAdapter interface using Dexie (IndexedDB).
 * Provides all database operations for the web platform.
 *
 * Platform: Web only
 */

import type {
  Account,
  AccountFilters,
  Budget,
  BudgetFilters,
  Category,
  CategoryFilters,
  CreateAccountInput,
  CreateBudgetInput,
  CreateCategoryInput,
  CreateGoalInput,
  CreateTransactionInput,
  ExportData,
  Goal,
  GoalFilters,
  IDatabaseAdapter,
  QueryOptions,
  Transaction,
  TransactionFilters,
  UpdateAccountInput,
  UpdateBudgetInput,
  UpdateCategoryInput,
  UpdateGoalInput,
  UpdateTransactionInput,
  User,
} from '@kakeibo/core';
import {
  cleanExportData,
  detectBackupUserId,
  generateId,
  generateMigrationReport,
  migrateBudgetCategoryIds,
  normalizeCategoryId,
  normalizeCategoryIdsInRecord,
  remapUserId,
  validateFinancialMonthStartDay,
} from '@kakeibo/core';
import { db } from './index';

// ID generators with entity-specific prefixes for better debugging and clarity
const generateTransactionId = () => `tr-${generateId()}`;
const generateAccountId = () => `acc-${generateId()}`;
const generateCategoryId = () => `cat-${generateId()}`;
const generateBudgetId = () => `bud-${generateId()}`;
const generateGoalId = () => `goal-${generateId()}`;

/**
 * Dexie adapter implementing IDatabaseAdapter
 */
export class DexieAdapter implements IDatabaseAdapter {
  // ==================== User Operations ====================

  async getUser(userId: string): Promise<User | undefined> {
    return db.users.get(userId);
  }

  async createUser(user: User): Promise<User> {
    await db.users.add(user);
    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await db.users.update(userId, { ...updates, updatedAt: new Date() });
    const user = await db.users.get(userId);
    if (!user) throw new Error(`User ${userId} not found`);
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await db.transaction(
      'rw',
      [db.users, db.accounts, db.categories, db.transactions, db.budgets, db.goals],
      async () => {
        await db.users.delete(userId);
        await db.accounts.where('userId').equals(userId).delete();
        await db.categories.where('userId').equals(userId).delete();
        await db.transactions.where('userId').equals(userId).delete();
        await db.budgets.where('userId').equals(userId).delete();
        await db.goals.where('userId').equals(userId).delete();
      }
    );
  }

  // ==================== Account Operations ====================

  async getAccounts(userId: string, filters?: AccountFilters): Promise<Account[]> {
    const query = db.accounts.where('userId').equals(userId);

    let accounts = await query.toArray();

    // Ensure dates are Date objects
    accounts = accounts.map((a) => ({
      ...a,
      createdAt: a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt),
      updatedAt: a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt),
    }));

    // Apply filters
    if (!filters) return accounts;

    return accounts.filter((account) => {
      if (filters.type && account.type !== filters.type) return false;
      // Map isArchived filter to isActive (archived = !active)
      if (filters.isArchived !== undefined && account.isActive === filters.isArchived) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!account.name.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  }

  async getAccount(accountId: string): Promise<Account | undefined> {
    return db.accounts.get(accountId);
  }

  async createAccount(userId: string, input: CreateAccountInput): Promise<Account> {
    const now = new Date();
    const account: Account = {
      id: generateAccountId(),
      userId,
      ...input,
      balance: input.balance ?? 0,
      // Map isArchived from input (if provided) to isActive field in entity
      // isArchived in schema means "do you want to archive it?"
      // isActive in entity means "is it currently active?"
      isActive: !(input.isArchived ?? false),
      createdAt: now,
      updatedAt: now,
    };

    await db.accounts.add(account);
    return account;
  }

  async updateAccount(accountId: string, updates: UpdateAccountInput): Promise<Account> {
    await db.accounts.update(accountId, { ...updates, updatedAt: new Date() });
    const account = await db.accounts.get(accountId);
    if (!account) throw new Error(`Account ${accountId} not found`);
    return account;
  }

  async deleteAccount(accountId: string): Promise<void> {
    // Check if account has transactions
    const transactionCount = await db.transactions.where('accountId').equals(accountId).count();

    if (transactionCount > 0) {
      throw new Error('Cannot delete account with existing transactions. Archive it instead.');
    }

    // Also check if account is used as destination in transfers
    const transferCount = await db.transactions.where('toAccountId').equals(accountId).count();

    if (transferCount > 0) {
      throw new Error(
        'Cannot delete account with existing transfer transactions. Archive it instead.'
      );
    }

    await db.accounts.delete(accountId);
  }

  async updateAccountBalance(accountId: string, newBalance: number): Promise<void> {
    await db.accounts.update(accountId, { balance: newBalance, updatedAt: new Date() });
  }

  // ==================== Category Operations ====================

  async getCategories(userId: string, filters?: CategoryFilters): Promise<Category[]> {
    const query = db.categories.where('userId').equals(userId);

    const categories = await query.toArray();

    // Apply filters
    if (!filters) return categories;

    return categories.filter((category) => {
      if (filters.type && category.type !== filters.type) return false;
      if (filters.parentId && category.parentId !== filters.parentId) return false;
      if (filters.isDefault !== undefined && category.isDefault !== filters.isDefault) return false;
      return true;
    });
  }

  async getCategory(categoryId: string): Promise<Category | undefined> {
    return db.categories.get(categoryId);
  }

  async createCategory(userId: string, input: CreateCategoryInput): Promise<Category> {
    const category: Category = {
      id: generateCategoryId(),
      userId,
      ...input,
      parentId: input.parentId,
      isDefault: false,
      order: input.order ?? 0,
    };

    await db.categories.add(category);
    return category;
  }

  async updateCategory(categoryId: string, updates: UpdateCategoryInput): Promise<Category> {
    await db.categories.update(categoryId, updates);
    const category = await db.categories.get(categoryId);
    if (!category) throw new Error(`Category ${categoryId} not found`);
    return category;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await db.categories.delete(categoryId);
  }

  // ==================== Transaction Operations ====================

  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    options?: QueryOptions
  ): Promise<Transaction[]> {
    const query = db.transactions.where('userId').equals(userId);

    let transactions = await query.toArray();

    // Ensure dates are Date objects (they might be strings after import/storage)
    transactions = transactions.map((t) => ({
      ...t,
      date: t.date instanceof Date ? t.date : new Date(t.date),
      createdAt: t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt),
      updatedAt: t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt),
    }));

    // Apply filters
    if (filters) {
      transactions = transactions.filter((t) => this.matchesTransactionFilters(t, filters));
    }

    // Apply sorting
    if (options?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = options;
      transactions.sort((a, b) => {
        const aVal = a[sortBy as keyof Transaction];
        const bVal = b[sortBy as keyof Transaction];
        if (aVal === undefined || bVal === undefined) return 0;
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default: sort by date descending
      transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    // Apply pagination
    if (options?.limit) {
      const start = options.offset ?? 0;
      transactions = transactions.slice(start, start + options.limit);
    }

    return transactions;
  }

  async getTransaction(transactionId: string): Promise<Transaction | undefined> {
    return db.transactions.get(transactionId);
  }

  async createTransaction(userId: string, input: CreateTransactionInput): Promise<Transaction> {
    const now = new Date();
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      accountId: input.accountId,
      // Parse amount from string to number
      amount: typeof input.amount === 'string' ? parseFloat(input.amount) : input.amount,
      type: input.type,
      categoryId: input.categoryId ?? '',
      subcategoryId: input.subcategoryId,
      description: input.description,
      // Convert string date to Date object
      date: input.date ? new Date(input.date) : now,
      tags: [], // Not in input schema yet
      location: input.location,
      receipt: undefined, // Receipt upload not implemented yet
      isRecurring: !!input.recurring,
      recurringId: input.recurring ? generateTransactionId() : undefined,
      toAccountId: input.toAccountId,
      goalId: input.goalId,
      isEssential: input.isEssential,
      synced: false,
      createdAt: now,
      updatedAt: now,
    };

    await db.transaction('rw', [db.transactions, db.accounts], async () => {
      await db.transactions.add(transaction);

      // Update account balance
      const account = await db.accounts.get(input.accountId);
      if (account) {
        let newBalance = account.balance;

        switch (transaction.type) {
          case 'income':
          case 'goal-withdrawal':
            newBalance += transaction.amount;
            break;
          case 'expense':
          case 'goal-contribution':
            newBalance -= transaction.amount;
            break;
          case 'transfer':
            newBalance -= transaction.amount;
            if (transaction.toAccountId) {
              const toAccount = await db.accounts.get(transaction.toAccountId);
              if (toAccount) {
                await db.accounts.update(transaction.toAccountId, {
                  balance: toAccount.balance + transaction.amount,
                  updatedAt: now,
                });
              }
            }
            break;
        }

        await db.accounts.update(input.accountId, { balance: newBalance, updatedAt: now });
      }
    });

    return transaction;
  }

  async updateTransaction(
    transactionId: string,
    updates: UpdateTransactionInput
  ): Promise<Transaction> {
    const oldTransaction = await db.transactions.get(transactionId);
    if (!oldTransaction) throw new Error(`Transaction ${transactionId} not found`);

    await db.transaction('rw', [db.transactions, db.accounts], async () => {
      // Revert old transaction's balance changes
      await this.revertTransactionBalance(oldTransaction);

      // Prepare updates with proper type conversions
      const processedUpdates: Partial<Transaction> = {};
      if (updates.amount !== undefined) {
        processedUpdates.amount =
          typeof updates.amount === 'string' ? parseFloat(updates.amount) : updates.amount;
      }
      if (updates.date !== undefined) {
        processedUpdates.date = new Date(updates.date);
      }
      // Copy other fields
      if (updates.type !== undefined) processedUpdates.type = updates.type;
      if (updates.description !== undefined) processedUpdates.description = updates.description;
      if (updates.accountId !== undefined) processedUpdates.accountId = updates.accountId;
      if (updates.categoryId !== undefined) processedUpdates.categoryId = updates.categoryId;
      if (updates.subcategoryId !== undefined)
        processedUpdates.subcategoryId = updates.subcategoryId;
      if (updates.toAccountId !== undefined) processedUpdates.toAccountId = updates.toAccountId;
      if (updates.goalId !== undefined) processedUpdates.goalId = updates.goalId;
      if (updates.isEssential !== undefined) processedUpdates.isEssential = updates.isEssential;
      if (updates.location !== undefined) processedUpdates.location = updates.location;
      processedUpdates.updatedAt = new Date();

      // Update transaction
      await db.transactions.update(transactionId, processedUpdates);

      const updatedTransaction = await db.transactions.get(transactionId);
      if (!updatedTransaction)
        throw new Error(`Transaction ${transactionId} not found after update`);

      // Apply new transaction's balance changes
      await this.applyTransactionBalance(updatedTransaction);
    });

    const transaction = await db.transactions.get(transactionId);
    if (!transaction) throw new Error(`Transaction ${transactionId} not found`);
    return transaction;
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    const transaction = await db.transactions.get(transactionId);
    if (!transaction) return;

    await db.transaction('rw', [db.transactions, db.accounts], async () => {
      await this.revertTransactionBalance(transaction);
      await db.transactions.delete(transactionId);
    });
  }

  async getTransactionsByAccount(
    accountId: string,
    options?: QueryOptions
  ): Promise<Transaction[]> {
    let transactions = await db.transactions.where('accountId').equals(accountId).toArray();

    if (options?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = options;
      transactions.sort((a, b) => {
        const aVal = a[sortBy as keyof Transaction];
        const bVal = b[sortBy as keyof Transaction];
        if (aVal === undefined || bVal === undefined) return 0;
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (options?.limit) {
      const start = options.offset ?? 0;
      transactions = transactions.slice(start, start + options.limit);
    }

    return transactions;
  }

  async getTransactionsByCategory(
    categoryId: string,
    options?: QueryOptions
  ): Promise<Transaction[]> {
    let transactions = await db.transactions.where('categoryId').equals(categoryId).toArray();

    if (options?.sortBy) {
      const { sortBy, sortOrder = 'asc' } = options;
      transactions.sort((a, b) => {
        const aVal = a[sortBy as keyof Transaction];
        const bVal = b[sortBy as keyof Transaction];
        if (aVal === undefined || bVal === undefined) return 0;
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (options?.limit) {
      const start = options.offset ?? 0;
      transactions = transactions.slice(start, start + options.limit);
    }

    return transactions;
  }

  // ==================== Budget Operations ====================

  async getBudgets(userId: string, filters?: BudgetFilters): Promise<Budget[]> {
    const query = db.budgets.where('userId').equals(userId);

    let budgets = await query.toArray();

    // Ensure dates are Date objects
    budgets = budgets.map((b) => ({
      ...b,
      startDate: b.startDate instanceof Date ? b.startDate : new Date(b.startDate),
      endDate: b.endDate
        ? b.endDate instanceof Date
          ? b.endDate
          : new Date(b.endDate)
        : undefined,
      createdAt: b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt),
      updatedAt: b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt),
    }));

    if (!filters) return budgets;

    return budgets.filter((budget) => {
      // Check if budget includes the filtered category
      if (filters.categoryId && !budget.categoryIds.includes(filters.categoryId)) return false;
      if (filters.period && budget.period !== filters.period) return false;
      if (filters.isActive !== undefined && budget.isActive !== filters.isActive) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!budget.name.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  }

  async getBudget(budgetId: string): Promise<Budget | undefined> {
    return db.budgets.get(budgetId);
  }

  async createBudget(userId: string, input: CreateBudgetInput): Promise<Budget> {
    const now = new Date();
    const budget: Budget = {
      id: generateBudgetId(),
      userId,
      name: input.name,
      categoryIds: input.categoryIds,
      amount: input.amount,
      period: input.period,
      // Convert string dates to Date objects, startDate is required
      startDate: input.startDate ? new Date(input.startDate) : now,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      spent: 0,
      rollover: input.rollover ?? false,
      isActive: input.isActive ?? true,
      // Default alerts configuration - use alertThresholds from input if provided
      alerts: {
        thresholds: input.alertThresholds ?? [50, 80, 100],
        enabled: true,
      },
      createdAt: now,
      updatedAt: now,
    };

    await db.budgets.add(budget);
    return budget;
  }

  async updateBudget(budgetId: string, updates: UpdateBudgetInput): Promise<Budget> {
    // Prepare updates with proper type conversions
    const processedUpdates: Partial<Budget> = {};
    if (updates.name !== undefined) processedUpdates.name = updates.name;
    if (updates.categoryIds !== undefined) processedUpdates.categoryIds = updates.categoryIds;
    if (updates.amount !== undefined) processedUpdates.amount = updates.amount;
    if (updates.period !== undefined) processedUpdates.period = updates.period;
    if (updates.startDate !== undefined) processedUpdates.startDate = new Date(updates.startDate);
    if (updates.endDate !== undefined) processedUpdates.endDate = new Date(updates.endDate);
    if (updates.rollover !== undefined) processedUpdates.rollover = updates.rollover;
    if (updates.isActive !== undefined) processedUpdates.isActive = updates.isActive;
    if (updates.alertThresholds !== undefined) {
      processedUpdates.alerts = {
        thresholds: updates.alertThresholds,
        enabled: true,
      };
    }
    processedUpdates.updatedAt = new Date();

    await db.budgets.update(budgetId, processedUpdates);
    const budget = await db.budgets.get(budgetId);
    if (!budget) throw new Error(`Budget ${budgetId} not found`);
    return budget;
  }

  async deleteBudget(budgetId: string): Promise<void> {
    await db.budgets.delete(budgetId);
  }

  async updateBudgetSpent(budgetId: string, spent: number): Promise<void> {
    await db.budgets.update(budgetId, { spent, updatedAt: new Date() });
  }

  // ==================== Goal Operations ====================

  async getGoals(userId: string, filters?: GoalFilters): Promise<Goal[]> {
    const query = db.goals.where('userId').equals(userId);

    let goals = await query.toArray();

    // Ensure dates are Date objects
    goals = goals.map((g) => ({
      ...g,
      deadline: g.deadline
        ? g.deadline instanceof Date
          ? g.deadline
          : new Date(g.deadline)
        : undefined,
      createdAt: g.createdAt instanceof Date ? g.createdAt : new Date(g.createdAt),
      updatedAt: g.updatedAt instanceof Date ? g.updatedAt : new Date(g.updatedAt),
    }));

    if (!filters) return goals;

    return goals.filter((goal) => {
      if (filters.type && goal.type !== filters.type) return false;
      // Map isArchived filter to status (archived goals have status 'cancelled')
      if (filters.isArchived !== undefined) {
        const isArchived = goal.status === 'cancelled';
        if (isArchived !== filters.isArchived) return false;
      }
      if (filters.isCompleted !== undefined) {
        const isCompleted = goal.status === 'completed';
        if (isCompleted !== filters.isCompleted) return false;
      }
      if (filters.accountId && goal.accountId !== filters.accountId) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!goal.name.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  }

  async getGoal(goalId: string): Promise<Goal | undefined> {
    return db.goals.get(goalId);
  }

  async createGoal(userId: string, input: CreateGoalInput): Promise<Goal> {
    const now = new Date();
    const goal: Goal = {
      id: generateGoalId(),
      userId,
      name: input.name,
      type: input.type,
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount ?? 0,
      // Convert string deadline to Date object
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      accountId: input.accountId,
      color: input.color ?? '#5B6EF5', // Default primary color
      icon: 'target', // Goal type has icon field based on the type
      status: input.isArchived ? 'cancelled' : 'active', // Map isArchived to status
      createdAt: now,
      updatedAt: now,
    };

    await db.goals.add(goal);
    return goal;
  }

  async updateGoal(goalId: string, updates: UpdateGoalInput): Promise<Goal> {
    // Prepare updates with proper type conversions
    const processedUpdates: Partial<Goal> = {};
    if (updates.name !== undefined) processedUpdates.name = updates.name;
    if (updates.type !== undefined) processedUpdates.type = updates.type;
    if (updates.targetAmount !== undefined) processedUpdates.targetAmount = updates.targetAmount;
    if (updates.currentAmount !== undefined) processedUpdates.currentAmount = updates.currentAmount;
    if (updates.deadline !== undefined) processedUpdates.deadline = new Date(updates.deadline);
    if (updates.accountId !== undefined) processedUpdates.accountId = updates.accountId;
    if (updates.color !== undefined) processedUpdates.color = updates.color;
    // Map isArchived to status
    if (updates.isArchived !== undefined) {
      processedUpdates.status = updates.isArchived ? 'cancelled' : 'active';
    }
    processedUpdates.updatedAt = new Date();

    await db.goals.update(goalId, processedUpdates);
    const goal = await db.goals.get(goalId);
    if (!goal) throw new Error(`Goal ${goalId} not found`);
    return goal;
  }

  async deleteGoal(goalId: string): Promise<void> {
    const goal = await db.goals.get(goalId);
    if (!goal) throw new Error('Goal not found');

    // Find all transactions related to this goal
    const goalTransactions = await db.transactions.where('goalId').equals(goalId).toArray();

    await db.transaction('rw', [db.goals, db.accounts, db.transactions], async () => {
      // Revert account balances for all goal transactions
      for (const transaction of goalTransactions) {
        const account = await db.accounts.get(transaction.accountId);
        if (account) {
          let newBalance = account.balance;

          // Reverse the transaction effect
          if (transaction.type === 'goal-contribution') {
            // Contribution deducted from account, so add it back
            newBalance += transaction.amount;
          } else if (transaction.type === 'goal-withdrawal') {
            // Withdrawal added to account, so deduct it back
            newBalance -= transaction.amount;
          }

          await db.accounts.update(transaction.accountId, {
            balance: newBalance,
            updatedAt: new Date(),
          });
        }
      }

      // Delete all goal transactions
      await db.transactions.where('goalId').equals(goalId).delete();

      // Delete the goal
      await db.goals.delete(goalId);
    });
  }

  async updateGoalAmount(goalId: string, amount: number): Promise<void> {
    await db.goals.update(goalId, { currentAmount: amount, updatedAt: new Date() });
  }

  async contributeToGoal(
    goalId: string,
    amount: number,
    accountId: string,
    description?: string
  ): Promise<Transaction> {
    const goal = await db.goals.get(goalId);
    if (!goal) throw new Error('Goal not found');

    const account = await db.accounts.get(accountId);
    if (!account) throw new Error('Account not found');

    const newAmount = goal.currentAmount + amount;
    const transactionId = generateTransactionId();

    const transaction: Transaction = {
      id: transactionId,
      userId: goal.userId,
      type: 'goal-contribution',
      amount,
      description: description || `Contribution to ${goal.name}`,
      accountId,
      categoryId: '', // Goal transactions don't require category
      goalId,
      date: new Date(),
      tags: [],
      isRecurring: false,
      synced: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.transaction('rw', [db.goals, db.accounts, db.transactions], async () => {
      // Update goal amount
      await db.goals.update(goalId, {
        currentAmount: newAmount,
        updatedAt: new Date(),
      });

      // Deduct from account
      await db.accounts.update(accountId, {
        balance: account.balance - amount,
        updatedAt: new Date(),
      });

      // Create transaction
      await db.transactions.add(transaction);
    });

    return transaction;
  }

  async withdrawFromGoal(
    goalId: string,
    amount: number,
    accountId: string,
    description?: string
  ): Promise<Transaction> {
    const goal = await db.goals.get(goalId);
    if (!goal) throw new Error('Goal not found');

    if (goal.currentAmount < amount) {
      throw new Error('Insufficient goal balance');
    }

    const account = await db.accounts.get(accountId);
    if (!account) throw new Error('Account not found');

    const newAmount = goal.currentAmount - amount;
    const transactionId = generateTransactionId();

    const transaction: Transaction = {
      id: transactionId,
      userId: goal.userId,
      type: 'goal-withdrawal',
      amount,
      description: description || `Withdrawal from ${goal.name}`,
      accountId,
      categoryId: '', // Goal transactions don't require category
      goalId,
      date: new Date(),
      tags: [],
      isRecurring: false,
      synced: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.transaction('rw', [db.goals, db.accounts, db.transactions], async () => {
      // Update goal amount
      await db.goals.update(goalId, {
        currentAmount: newAmount,
        updatedAt: new Date(),
      });

      // Credit to account
      await db.accounts.update(accountId, {
        balance: account.balance + amount,
        updatedAt: new Date(),
      });

      // Create transaction
      await db.transactions.add(transaction);
    });

    return transaction;
  }

  // ==================== Backup & Restore ====================

  async exportDatabase(userId?: string): Promise<string> {
    // Get user's settings if userId provided
    let settings: User['settings'] | undefined;
    let users: User[] = [];

    if (userId) {
      const user = await db.users.get(userId);
      if (user) {
        users = [user];
        settings = user.settings;
      }
    } else {
      users = await db.users.toArray();
    }

    const exportData: ExportData = {
      users,
      accounts: userId
        ? await db.accounts.where('userId').equals(userId).toArray()
        : await db.accounts.toArray(),
      categories: userId
        ? await db.categories.where('userId').equals(userId).toArray()
        : await db.categories.toArray(),
      transactions: userId
        ? await db.transactions.where('userId').equals(userId).toArray()
        : await db.transactions.toArray(),
      budgets: userId
        ? await db.budgets.where('userId').equals(userId).toArray()
        : await db.budgets.toArray(),
      goals: userId
        ? await db.goals.where('userId').equals(userId).toArray()
        : await db.goals.toArray(),
      settings,
      exportedAt: new Date().toISOString(),
      version: '2.0.0', // App version
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importDatabase(jsonData: string, targetUserId?: string): Promise<void> {
    const rawData = JSON.parse(jsonData) as ExportData;

    // Clean and validate data
    const data = cleanExportData(rawData);

    // Detect source user ID
    const sourceUserId = detectBackupUserId(data);

    // Generate migration report for logging
    const report = generateMigrationReport(data);
    console.log('Import Report:', report);

    await db.transaction(
      'rw',
      [db.users, db.accounts, db.categories, db.transactions, db.budgets, db.goals],
      async () => {
        // 1. Handle user records (update existing user if targetUserId provided)
        if (data.users && targetUserId) {
          const user = await db.users.get(targetUserId);
          if (user && data.settings) {
            // Merge settings from backup with existing user
            await db.users.update(targetUserId, {
              settings: {
                ...user.settings,
                ...data.settings,
                financialMonthStart: validateFinancialMonthStartDay(
                  data.settings.financialMonthStart,
                  user.settings?.financialMonthStart ?? 1
                ),
              },
            });
          }
        } else if (data.users && !targetUserId) {
          // Import users as-is (full database restore)
          await db.users.bulkPut(data.users);
        }

        // 2. Import accounts with user ID remapping
        if (data.accounts) {
          const accounts =
            targetUserId && sourceUserId
              ? data.accounts.map((acc) => remapUserId(acc, targetUserId))
              : data.accounts;
          await db.accounts.bulkPut(accounts);
        }

        // 3. Import categories with normalization and user ID remapping
        if (data.categories) {
          const categories = data.categories.map((cat) => {
            // Normalize category ID for v1 compatibility
            const normalized = { ...cat, id: normalizeCategoryId(cat.id) };
            return targetUserId && sourceUserId
              ? remapUserId(normalized, targetUserId)
              : normalized;
          });
          await db.categories.bulkPut(categories);
        }

        // 4. Import transactions with category ID normalization and user ID remapping
        if (data.transactions) {
          const transactions = data.transactions.map((txn) => {
            // Normalize category IDs in transaction
            const normalized = normalizeCategoryIdsInRecord(txn);
            return targetUserId && sourceUserId
              ? remapUserId(normalized, targetUserId)
              : normalized;
          });
          await db.transactions.bulkPut(transactions);
        }

        // 5. Import budgets with multi-category migration and normalization
        if (data.budgets) {
          const budgets = data.budgets.map((budget) => {
            // Migrate old single-category format to new multi-category format
            const migrated = migrateBudgetCategoryIds(budget);
            // Normalize category IDs
            const normalized = normalizeCategoryIdsInRecord(migrated);
            return targetUserId && sourceUserId
              ? remapUserId(normalized, targetUserId)
              : normalized;
          });
          await db.budgets.bulkPut(budgets);
        }

        // 6. Import goals with user ID remapping
        if (data.goals) {
          const goals =
            targetUserId && sourceUserId
              ? data.goals.map((goal) => remapUserId(goal, targetUserId))
              : data.goals;
          await db.goals.bulkPut(goals);
        }
      }
    );

    console.log('Import completed successfully');
  }

  async clearDatabase(): Promise<void> {
    await db.transaction(
      'rw',
      [db.users, db.accounts, db.categories, db.transactions, db.budgets, db.goals],
      async () => {
        await db.users.clear();
        await db.accounts.clear();
        await db.categories.clear();
        await db.transactions.clear();
        await db.budgets.clear();
        await db.goals.clear();
      }
    );
  }

  // ==================== Utility Operations ====================

  async getTotalBalance(userId: string, excludeInactive?: boolean): Promise<number> {
    const accounts = await this.getAccounts(
      userId,
      excludeInactive ? { isArchived: false } : undefined
    );
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  async getNetWorth(userId: string): Promise<number> {
    const accounts = await this.getAccounts(userId);
    // In v2, credit cards have negative balances, all others are assets
    const total = accounts.reduce((sum, a) => {
      // Credit card balances are typically negative (owed amount)
      if (a.type === 'credit') {
        return sum + a.balance; // balance is already negative for debt
      }
      return sum + a.balance;
    }, 0);
    return total;
  }

  async getTransactionCount(userId: string, filters?: TransactionFilters): Promise<number> {
    const transactions = await this.getTransactions(userId, filters);
    return transactions.length;
  }

  // ==================== Private Helper Methods ====================

  private matchesTransactionFilters(
    transaction: Transaction,
    filters: TransactionFilters
  ): boolean {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.accountId && transaction.accountId !== filters.accountId) return false;
    if (filters.categoryId && transaction.categoryId !== filters.categoryId) return false;
    if (filters.subcategoryId && transaction.subcategoryId !== filters.subcategoryId) return false;
    if (filters.goalId && transaction.goalId !== filters.goalId) return false;

    // Date filters - convert string dates to Date for comparison
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      if (transaction.date < startDate) return false;
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      if (transaction.date > endDate) return false;
    }

    if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) return false;
    if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) return false;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      const desc = transaction.description?.toLowerCase() ?? '';
      if (!desc.includes(search)) return false;
    }

    if (filters.isEssential !== undefined && transaction.isEssential !== filters.isEssential)
      return false;

    return true;
  }

  private async revertTransactionBalance(transaction: Transaction): Promise<void> {
    const account = await db.accounts.get(transaction.accountId);
    if (!account) return;

    let newBalance = account.balance;
    const now = new Date();

    switch (transaction.type) {
      case 'income':
      case 'goal-withdrawal':
        newBalance -= transaction.amount;
        break;
      case 'expense':
      case 'goal-contribution':
        newBalance += transaction.amount;
        break;
      case 'transfer':
        newBalance += transaction.amount;
        if (transaction.toAccountId) {
          const toAccount = await db.accounts.get(transaction.toAccountId);
          if (toAccount) {
            await db.accounts.update(transaction.toAccountId, {
              balance: toAccount.balance - transaction.amount,
              updatedAt: now,
            });
          }
        }
        break;
    }

    await db.accounts.update(transaction.accountId, { balance: newBalance, updatedAt: now });
  }

  private async applyTransactionBalance(transaction: Transaction): Promise<void> {
    const account = await db.accounts.get(transaction.accountId);
    if (!account) return;

    let newBalance = account.balance;
    const now = new Date();

    switch (transaction.type) {
      case 'income':
      case 'goal-withdrawal':
        newBalance += transaction.amount;
        break;
      case 'expense':
      case 'goal-contribution':
        newBalance -= transaction.amount;
        break;
      case 'transfer':
        newBalance -= transaction.amount;
        if (transaction.toAccountId) {
          const toAccount = await db.accounts.get(transaction.toAccountId);
          if (toAccount) {
            await db.accounts.update(transaction.toAccountId, {
              balance: toAccount.balance + transaction.amount,
              updatedAt: now,
            });
          }
        }
        break;
    }

    await db.accounts.update(transaction.accountId, { balance: newBalance, updatedAt: now });
  }

  // ==================== Data Migration ====================

  /**
   * Migrate all data from guest user to authenticated user
   */
  async migrateGuestDataToUser(
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
  }> {
    const counts = {
      transactions: 0,
      budgets: 0,
      goals: 0,
      accounts: 0,
      categories: 0,
    };

    try {
      // Perform all migrations in a single transaction for atomicity
      await db.transaction(
        'rw',
        [db.transactions, db.budgets, db.goals, db.accounts, db.categories, db.users],
        async () => {
          const now = new Date();

          // 1. Migrate transactions
          const transactions = await db.transactions
            .where('userId')
            .equals(fromGuestUserId)
            .toArray();
          for (const transaction of transactions) {
            await db.transactions.update(transaction.id, {
              userId: toAuthUserId,
              updatedAt: now,
            });
            counts.transactions++;
          }

          // 2. Migrate budgets
          const budgets = await db.budgets.where('userId').equals(fromGuestUserId).toArray();
          for (const budget of budgets) {
            await db.budgets.update(budget.id, {
              userId: toAuthUserId,
              updatedAt: now,
            });
            counts.budgets++;
          }

          // 3. Migrate goals
          const goals = await db.goals.where('userId').equals(fromGuestUserId).toArray();
          for (const goal of goals) {
            await db.goals.update(goal.id, {
              userId: toAuthUserId,
              updatedAt: now,
            });
            counts.goals++;
          }

          // 4. Migrate accounts
          const accounts = await db.accounts.where('userId').equals(fromGuestUserId).toArray();
          for (const account of accounts) {
            await db.accounts.update(account.id, {
              userId: toAuthUserId,
              updatedAt: now,
            });
            counts.accounts++;
          }

          // 5. Migrate custom categories (skip default categories)
          const categories = await db.categories
            .where('userId')
            .equals(fromGuestUserId)
            .and((cat) => !cat.isDefault)
            .toArray();
          for (const category of categories) {
            await db.categories
              .where('id')
              .equals(category.id)
              .modify((cat) => {
                cat.userId = toAuthUserId;
              });
            counts.categories++;
          }

          // 6. Delete the guest user
          await db.users.delete(fromGuestUserId);
        }
      );

      return {
        success: true,
        migratedCounts: counts,
      };
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        migratedCounts: counts,
        error: error instanceof Error ? error.message : 'Migration failed',
      };
    }
  }
}

// Export singleton instance
export const dexieAdapter = new DexieAdapter();
