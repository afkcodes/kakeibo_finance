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
import { generateId } from '@kakeibo/core';
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

    const accounts = await query.toArray();

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
      tags: [],  // Not in input schema yet
      location: input.location,
      receipt: undefined,  // Receipt upload not implemented yet
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
        processedUpdates.amount = typeof updates.amount === 'string' ? parseFloat(updates.amount) : updates.amount;
      }
      if (updates.date !== undefined) {
        processedUpdates.date = new Date(updates.date);
      }
      // Copy other fields
      if (updates.type !== undefined) processedUpdates.type = updates.type;
      if (updates.description !== undefined) processedUpdates.description = updates.description;
      if (updates.accountId !== undefined) processedUpdates.accountId = updates.accountId;
      if (updates.categoryId !== undefined) processedUpdates.categoryId = updates.categoryId;
      if (updates.subcategoryId !== undefined) processedUpdates.subcategoryId = updates.subcategoryId;
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

    const budgets = await query.toArray();

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

    const goals = await query.toArray();

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
      color: input.color ?? '#5B6EF5',  // Default primary color
      icon: 'target',  // Goal type has icon field based on the type
      status: input.isArchived ? 'cancelled' : 'active',  // Map isArchived to status
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
    await db.goals.delete(goalId);
  }

  async updateGoalAmount(goalId: string, amount: number): Promise<void> {
    await db.goals.update(goalId, { currentAmount: amount, updatedAt: new Date() });
  }

  // ==================== Backup & Restore ====================

  async exportDatabase(userId?: string): Promise<string> {
    const data = {
      users: userId ? [await db.users.get(userId)].filter(Boolean) : await db.users.toArray(),
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
    };

    return JSON.stringify(data, null, 2);
  }

  async importDatabase(jsonData: string, _targetUserId?: string): Promise<void> {
    const data = JSON.parse(jsonData);

    await db.transaction(
      'rw',
      [db.users, db.accounts, db.categories, db.transactions, db.budgets, db.goals],
      async () => {
        if (data.users) await db.users.bulkPut(data.users);
        if (data.accounts) await db.accounts.bulkPut(data.accounts);
        if (data.categories) await db.categories.bulkPut(data.categories);
        if (data.transactions) await db.transactions.bulkPut(data.transactions);
        if (data.budgets) await db.budgets.bulkPut(data.budgets);
        if (data.goals) await db.goals.bulkPut(data.goals);
      }
    );
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
    
    if (filters.isEssential !== undefined && transaction.isEssential !== filters.isEssential) return false;
    
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
}

// Export singleton instance
export const dexieAdapter = new DexieAdapter();
