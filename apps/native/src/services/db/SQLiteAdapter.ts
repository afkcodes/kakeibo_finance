/**
 * @fileoverview SQLite database adapter for native platform
 * @module @kakeibo/native/services/db
 *
 * Implements IDatabaseAdapter interface using OP-SQLite.
 * Provides all database operations for the native platform.
 *
 * Platform: Native only
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
  calculateAccountBalance,
  cleanExportData,
  defaultExpenseCategories,
  defaultIncomeCategories,
  detectBackupUserId,
  generateId,
  generateMigrationReport,
  migrateBudgetCategoryIds,
  normalizeCategoryIdsInRecord,
  remapUserId,
} from '@kakeibo/core';
import { getDatabase } from './index';
import { dropAllTables, initializeDatabase } from './migrations';

// ID generators with entity-specific prefixes for better debugging and clarity
const generateTransactionId = () => `tr-${generateId()}`;
const generateAccountId = () => `acc-${generateId()}`;
const generateCategoryId = () => `cat-${generateId()}`;
const generateBudgetId = () => `bud-${generateId()}`;
const generateGoalId = () => `goal-${generateId()}`;

/**
 * SQLite adapter implementing IDatabaseAdapter
 */
export class SQLiteAdapter implements IDatabaseAdapter {
  // ==================== User Operations ====================

  async getUser(userId: string): Promise<User | undefined> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

    if (result.rows.length === 0) return undefined;

    return this.parseUser(result.rows[0]);
  }

  async createUser(user: User): Promise<User> {
    const db = await getDatabase();

    await db.execute(
      `INSERT INTO users (id, email, displayName, photoURL, settings, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.email ?? null,
        user.displayName ?? null,
        user.photoURL ?? null,
        JSON.stringify(user.settings),
        user.createdAt.toISOString(),
        user.updatedAt.toISOString(),
      ]
    );

    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const db = await getDatabase();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.email !== undefined) {
      updateFields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.displayName !== undefined) {
      updateFields.push('displayName = ?');
      values.push(updates.displayName);
    }
    if (updates.photoURL !== undefined) {
      updateFields.push('photoURL = ?');
      values.push(updates.photoURL);
    }
    if (updates.settings !== undefined) {
      updateFields.push('settings = ?');
      values.push(JSON.stringify(updates.settings));
    }

    // Always update updatedAt
    updateFields.push('updatedAt = ?');
    values.push(new Date().toISOString());

    // Add userId at the end for WHERE clause
    values.push(userId);

    await db.execute(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, values);

    const user = await this.getUser(userId);
    if (!user) throw new Error(`User ${userId} not found`);
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const db = await getDatabase();

    // Foreign key constraints with CASCADE will handle related records
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
  }

  // ==================== Account Operations ====================

  async getAccounts(userId: string, filters?: AccountFilters): Promise<Account[]> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM accounts WHERE userId = ?', [userId]);

    const accounts = result.rows.map((row) => this.parseAccount(row));

    // Calculate balances for all accounts
    const accountsWithBalance = await Promise.all(
      accounts.map((account) => this.calculateAndSetAccountBalance(account))
    );

    // Apply filters
    if (!filters) return accountsWithBalance;

    return accountsWithBalance.filter((account) => {
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
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM accounts WHERE id = ?', [accountId]);

    if (result.rows.length === 0) return undefined;

    const account = this.parseAccount(result.rows[0]);
    return this.calculateAndSetAccountBalance(account);
  }

  async createAccount(userId: string, input: CreateAccountInput): Promise<Account> {
    const db = await getDatabase();
    const now = new Date();
    const account: Account = {
      id: generateAccountId(),
      userId,
      ...input,
      initialBalance: input.initialBalance ?? 0,
      balance: input.initialBalance ?? 0, // Same as initialBalance at creation
      // Map isArchived from input (if provided) to isActive field in entity
      isActive: !(input.isArchived ?? false),
      createdAt: now,
      updatedAt: now,
    };

    await db.execute(
      `INSERT INTO accounts (id, userId, name, type, initialBalance, currency, icon, color, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        account.id,
        account.userId,
        account.name,
        account.type,
        account.initialBalance,
        account.currency,
        account.icon ?? null,
        account.color ?? null,
        account.isActive ? 1 : 0,
        account.createdAt.toISOString(),
        account.updatedAt.toISOString(),
      ]
    );

    return account;
  }

  async updateAccount(accountId: string, updates: UpdateAccountInput): Promise<Account> {
    const db = await getDatabase();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.type !== undefined) {
      updateFields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.initialBalance !== undefined) {
      updateFields.push('initialBalance = ?');
      values.push(updates.initialBalance);
    }
    if (updates.currency !== undefined) {
      updateFields.push('currency = ?');
      values.push(updates.currency);
    }
    if (updates.icon !== undefined) {
      updateFields.push('icon = ?');
      values.push(updates.icon);
    }
    if (updates.color !== undefined) {
      updateFields.push('color = ?');
      values.push(updates.color);
    }
    if (updates.isArchived !== undefined) {
      updateFields.push('isActive = ?');
      values.push(updates.isArchived ? 0 : 1);
    }

    // Always update updatedAt
    updateFields.push('updatedAt = ?');
    values.push(new Date().toISOString());

    values.push(accountId);

    await db.execute(`UPDATE accounts SET ${updateFields.join(', ')} WHERE id = ?`, values);

    const account = await this.getAccount(accountId);
    if (!account) throw new Error(`Account ${accountId} not found`);
    return account;
  }

  async deleteAccount(accountId: string): Promise<void> {
    const db = await getDatabase();

    // Check if account has transactions
    const transactionResult = await db.execute(
      'SELECT COUNT(*) as count FROM transactions WHERE accountId = ?',
      [accountId]
    );
    const transactionCount = (transactionResult.rows?.[0]?.count as number) || 0;

    if (transactionCount > 0) {
      throw new Error('Cannot delete account with existing transactions. Archive it instead.');
    }

    // Check if account is used as destination in transfers
    const transferResult = await db.execute(
      'SELECT COUNT(*) as count FROM transactions WHERE toAccountId = ?',
      [accountId]
    );
    const transferCount = (transferResult.rows?.[0]?.count as number) || 0;

    if (transferCount > 0) {
      throw new Error(
        'Cannot delete account with existing transfer transactions. Archive it instead.'
      );
    }

    await db.execute('DELETE FROM accounts WHERE id = ?', [accountId]);
  }

  // Balance is now calculated from initialBalance + transactions, no direct updates needed

  // ==================== Category Operations ====================

  async getCategories(userId: string, filters?: CategoryFilters): Promise<Category[]> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM categories WHERE userId = ? ORDER BY "order"', [
      userId,
    ]);

    const categories = result.rows.map((row) => this.parseCategory(row));

    // Apply filters
    if (!filters) return categories;

    return categories.filter((category) => {
      if (filters.type && category.type !== filters.type) return false;
      if (filters.parentId !== undefined && category.parentId !== filters.parentId) return false;
      if (filters.isDefault !== undefined && category.isDefault !== filters.isDefault) return false;
      return true;
    });
  }

  async getCategory(categoryId: string): Promise<Category | undefined> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM categories WHERE id = ?', [categoryId]);

    if (result.rows.length === 0) return undefined;
    return this.parseCategory(result.rows[0]);
  }

  async createCategory(userId: string, input: CreateCategoryInput): Promise<Category> {
    const db = await getDatabase();
    const now = new Date();
    const category: Category = {
      id: generateCategoryId(),
      userId,
      ...input,
      parentId: input.parentId,
      isDefault: false,
      order: input.order ?? 0,
    };

    await db.execute(
      `INSERT INTO categories (id, userId, name, type, icon, color, parentId, isDefault, "order", createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category.id,
        category.userId,
        category.name,
        category.type,
        category.icon,
        category.color,
        category.parentId ?? null,
        category.isDefault ? 1 : 0,
        category.order,
        now.toISOString(),
        now.toISOString(),
      ]
    );

    return category;
  }

  async updateCategory(categoryId: string, updates: UpdateCategoryInput): Promise<Category> {
    const db = await getDatabase();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.icon !== undefined) {
      updateFields.push('icon = ?');
      values.push(updates.icon);
    }
    if (updates.color !== undefined) {
      updateFields.push('color = ?');
      values.push(updates.color);
    }
    if (updates.order !== undefined) {
      updateFields.push('"order" = ?');
      values.push(updates.order);
    }

    // Always update updatedAt
    updateFields.push('updatedAt = ?');
    values.push(new Date().toISOString());

    values.push(categoryId);

    await db.execute(`UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`, values);

    const category = await this.getCategory(categoryId);
    if (!category) throw new Error(`Category ${categoryId} not found`);
    return category;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const db = await getDatabase();
    await db.execute('DELETE FROM categories WHERE id = ?', [categoryId]);
  }

  async initializeDefaultCategories(userId: string): Promise<void> {
    const _db = await getDatabase();

    // Get existing categories to avoid duplicates
    const existing = await this.getCategories(userId);
    if (existing.length > 0) return;

    // Create expense categories
    for (const category of defaultExpenseCategories) {
      await this.createCategory(userId, {
        ...category,
        type: 'expense',
      });
    }

    // Create income categories
    for (const category of defaultIncomeCategories) {
      await this.createCategory(userId, {
        ...category,
        type: 'income',
      });
    }
  }

  // ==================== Transaction Operations ====================

  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
    options?: QueryOptions
  ): Promise<Transaction[]> {
    const db = await getDatabase();

    // Build query with filters
    let sql = 'SELECT * FROM transactions WHERE userId = ?';
    const params: any[] = [userId];

    if (filters?.type) {
      sql += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters?.categoryId) {
      sql += ' AND (categoryId = ? OR subcategoryId = ?)';
      params.push(filters.categoryId, filters.categoryId);
    }
    if (filters?.accountId) {
      sql += ' AND (accountId = ? OR toAccountId = ?)';
      params.push(filters.accountId, filters.accountId);
    }
    if (filters?.startDate) {
      sql += ' AND date >= ?';
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      sql += ' AND date <= ?';
      params.push(filters.endDate);
    }
    if (filters?.goalId) {
      sql += ' AND goalId = ?';
      params.push(filters.goalId);
    }
    if (filters?.isEssential !== undefined) {
      sql += ' AND isEssential = ?';
      params.push(filters.isEssential ? 1 : 0);
    }

    // Apply sorting
    if (options?.sortBy) {
      sql += ` ORDER BY ${options.sortBy} ${options.sortOrder === 'asc' ? 'ASC' : 'DESC'}`;
    } else {
      sql += ' ORDER BY date DESC';
    }

    // Apply pagination
    if (options?.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);

      if (options.offset) {
        sql += ' OFFSET ?';
        params.push(options.offset);
      }
    }

    const result = await db.execute(sql, params);
    return result.rows.map((row) => this.parseTransaction(row));
  }

  async getTransaction(transactionId: string): Promise<Transaction | undefined> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM transactions WHERE id = ?', [transactionId]);

    if (result.rows.length === 0) return undefined;
    return this.parseTransaction(result.rows[0]);
  }

  async createTransaction(userId: string, input: CreateTransactionInput): Promise<Transaction> {
    const db = await getDatabase();
    const now = new Date();

    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      accountId: input.accountId,
      categoryId: input.categoryId ?? '',
      subcategoryId: input.subcategoryId,
      amount: typeof input.amount === 'string' ? parseFloat(input.amount) : input.amount,
      type: input.type,
      description: input.description,
      date: input.date ? new Date(input.date) : now,
      tags: [],
      isRecurring: false,
      recurringId: undefined,
      toAccountId: input.toAccountId,
      goalId: input.goalId,
      isEssential: input.isEssential ?? false,
      synced: false,
      createdAt: now,
      updatedAt: now,
    };

    // Use transaction for atomicity
    await db.transaction(async (tx) => {
      // Create transaction record
      await tx.execute(
        `INSERT INTO transactions (id, userId, accountId, categoryId, subcategoryId, amount, type, description, date, tags, isRecurring, recurringId, toAccountId, goalId, isEssential, synced, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id,
          transaction.userId,
          transaction.accountId,
          transaction.categoryId,
          transaction.subcategoryId ?? null,
          transaction.amount,
          transaction.type,
          transaction.description ?? null,
          transaction.date.toISOString(),
          JSON.stringify(transaction.tags),
          transaction.isRecurring ? 1 : 0,
          transaction.recurringId ?? null,
          transaction.toAccountId ?? null,
          transaction.goalId ?? null,
          transaction.isEssential ? 1 : 0,
          transaction.synced ? 1 : 0,
          transaction.createdAt.toISOString(),
          transaction.updatedAt.toISOString(),
        ]
      );
    });

    return transaction;
  }

  async updateTransaction(
    transactionId: string,
    updates: UpdateTransactionInput
  ): Promise<Transaction> {
    const db = await getDatabase();

    const existing = await this.getTransaction(transactionId);
    if (!existing) throw new Error(`Transaction ${transactionId} not found`);

    await db.transaction(async (tx) => {
      // Build update query
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.accountId !== undefined) {
        updateFields.push('accountId = ?');
        values.push(updates.accountId);
      }
      if (updates.categoryId !== undefined) {
        updateFields.push('categoryId = ?');
        values.push(updates.categoryId);
      }
      if (updates.subcategoryId !== undefined) {
        updateFields.push('subcategoryId = ?');
        values.push(updates.subcategoryId ?? null);
      }
      if (updates.amount !== undefined) {
        updateFields.push('amount = ?');
        values.push(
          typeof updates.amount === 'string' ? parseFloat(updates.amount) : updates.amount
        );
      }
      if (updates.type !== undefined) {
        updateFields.push('type = ?');
        values.push(updates.type);
      }
      if (updates.description !== undefined) {
        updateFields.push('description = ?');
        values.push(updates.description ?? null);
      }
      if (updates.date !== undefined) {
        updateFields.push('date = ?');
        values.push(typeof updates.date === 'string' ? updates.date : new Date().toISOString());
      }
      if (updates.toAccountId !== undefined) {
        updateFields.push('toAccountId = ?');
        values.push(updates.toAccountId ?? null);
      }
      if (updates.goalId !== undefined) {
        updateFields.push('goalId = ?');
        values.push(updates.goalId ?? null);
      }
      if (updates.isEssential !== undefined) {
        updateFields.push('isEssential = ?');
        values.push(updates.isEssential ? 1 : 0);
      }

      // Always update updatedAt
      updateFields.push('updatedAt = ?');
      values.push(new Date().toISOString());

      values.push(transactionId);

      await tx.execute(`UPDATE transactions SET ${updateFields.join(', ')} WHERE id = ?`, values);

      // Get updated transaction (for return value)
      const result = await tx.execute('SELECT * FROM transactions WHERE id = ?', [transactionId]);
      const updated = this.parseTransaction(result.rows[0]!);
    });

    const transaction = await this.getTransaction(transactionId);
    if (!transaction) throw new Error(`Transaction ${transactionId} not found after update`);
    return transaction;
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    const db = await getDatabase();

    const transaction = await this.getTransaction(transactionId);
    if (!transaction) throw new Error(`Transaction ${transactionId} not found`);

    await db.transaction(async (tx) => {
      await tx.execute('DELETE FROM transactions WHERE id = ?', [transactionId]);
    });
  }

  // Balance is calculated from initialBalance + transactions, no update methods needed

  // ==================== Budget Operations ====================

  async getBudgets(userId: string, filters?: BudgetFilters): Promise<Budget[]> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM budgets WHERE userId = ?', [userId]);

    const budgets = result.rows.map((row) => this.parseBudget(row));

    // Apply filters
    if (!filters) return budgets;

    return budgets.filter((budget) => {
      if (filters.period && budget.period !== filters.period) return false;
      // Check if categoryId is in budget's categoryIds array
      if (filters.categoryId && !budget.categoryIds.includes(filters.categoryId)) return false;
      return true;
    });
  }

  async getBudget(budgetId: string): Promise<Budget | undefined> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM budgets WHERE id = ?', [budgetId]);

    if (result.rows.length === 0) return undefined;
    return this.parseBudget(result.rows[0]);
  }

  async createBudget(userId: string, input: CreateBudgetInput): Promise<Budget> {
    const db = await getDatabase();
    const now = new Date();

    const budget: Budget = {
      id: generateBudgetId(),
      userId,
      name: input.name,
      amount: typeof input.amount === 'string' ? parseFloat(input.amount) : input.amount,
      period: input.period,
      categoryIds: input.categoryIds,
      startDate: input.startDate ? new Date(input.startDate) : now,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      spent: 0,
      rollover: input.rollover ?? false,
      isActive: input.isActive ?? true,
      alerts: {
        thresholds: input.alertThresholds ?? [50, 80, 100],
        enabled: true,
      },
      createdAt: now,
      updatedAt: now,
    };

    await db.execute(
      `INSERT INTO budgets (id, userId, name, amount, period, categoryIds, startDate, endDate, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        budget.id,
        budget.userId,
        budget.name,
        budget.amount,
        budget.period,
        JSON.stringify(budget.categoryIds),
        budget.startDate.toISOString(),
        budget.endDate?.toISOString() ?? null,
        budget.createdAt.toISOString(),
        budget.updatedAt.toISOString(),
      ]
    );

    return budget;
  }

  async updateBudget(budgetId: string, updates: UpdateBudgetInput): Promise<Budget> {
    const db = await getDatabase();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.amount !== undefined) {
      updateFields.push('amount = ?');
      values.push(typeof updates.amount === 'string' ? parseFloat(updates.amount) : updates.amount);
    }
    if (updates.period !== undefined) {
      updateFields.push('period = ?');
      values.push(updates.period);
    }
    if (updates.categoryIds !== undefined) {
      updateFields.push('categoryIds = ?');
      values.push(JSON.stringify(updates.categoryIds));
    }
    if (updates.startDate !== undefined) {
      updateFields.push('startDate = ?');
      values.push(
        typeof updates.startDate === 'string' ? updates.startDate : new Date().toISOString()
      );
    }
    if (updates.endDate !== undefined) {
      updateFields.push('endDate = ?');
      values.push(
        updates.endDate
          ? typeof updates.endDate === 'string'
            ? updates.endDate
            : new Date().toISOString()
          : null
      );
    }

    // Always update updatedAt
    updateFields.push('updatedAt = ?');
    values.push(new Date().toISOString());

    values.push(budgetId);

    await db.execute(`UPDATE budgets SET ${updateFields.join(', ')} WHERE id = ?`, values);

    const budget = await this.getBudget(budgetId);
    if (!budget) throw new Error(`Budget ${budgetId} not found`);
    return budget;
  }

  async deleteBudget(budgetId: string): Promise<void> {
    const db = await getDatabase();
    await db.execute('DELETE FROM budgets WHERE id = ?', [budgetId]);
  }

  // ==================== Goal Operations ====================

  async getGoals(userId: string, filters?: GoalFilters): Promise<Goal[]> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM goals WHERE userId = ?', [userId]);

    const goals = result.rows.map((row) => this.parseGoal(row));

    // Apply filters
    if (!filters) return goals;

    return goals.filter((goal) => {
      if (filters.type && goal.type !== filters.type) return false;
      // Map isArchived to status
      if (filters.isArchived !== undefined) {
        const isArchived = goal.status === 'cancelled';
        if (filters.isArchived !== isArchived) return false;
      }
      // Map isCompleted to status
      if (filters.isCompleted !== undefined) {
        const isCompleted = goal.status === 'completed';
        if (filters.isCompleted !== isCompleted) return false;
      }
      return true;
    });
  }

  async getGoal(goalId: string): Promise<Goal | undefined> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM goals WHERE id = ?', [goalId]);

    if (result.rows.length === 0) return undefined;
    return this.parseGoal(result.rows[0]);
  }

  async createGoal(userId: string, input: CreateGoalInput): Promise<Goal> {
    const db = await getDatabase();
    const now = new Date();

    const goal: Goal = {
      id: generateGoalId(),
      userId,
      name: input.name,
      type: input.type,
      targetAmount:
        typeof input.targetAmount === 'string'
          ? parseFloat(input.targetAmount)
          : input.targetAmount,
      currentAmount: input.currentAmount
        ? typeof input.currentAmount === 'string'
          ? parseFloat(input.currentAmount)
          : input.currentAmount
        : 0,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      status: input.isArchived ? 'cancelled' : 'active',
      accountId: input.accountId,
      icon: 'target',
      color: input.color ?? '#5B6EF5',
      createdAt: now,
      updatedAt: now,
    };

    await db.execute(
      `INSERT INTO goals (id, userId, name, type, targetAmount, currentAmount, deadline, status, accountId, icon, color, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        goal.id,
        goal.userId,
        goal.name,
        goal.type,
        goal.targetAmount,
        goal.currentAmount,
        goal.deadline?.toISOString() ?? null,
        goal.status,
        goal.accountId ?? null,
        goal.icon,
        goal.color ?? null,
        goal.createdAt.toISOString(),
        goal.updatedAt.toISOString(),
      ]
    );

    return goal;
  }

  async updateGoal(goalId: string, updates: UpdateGoalInput): Promise<Goal> {
    const db = await getDatabase();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.targetAmount !== undefined) {
      updateFields.push('targetAmount = ?');
      values.push(
        typeof updates.targetAmount === 'string'
          ? parseFloat(updates.targetAmount)
          : updates.targetAmount
      );
    }
    if (updates.currentAmount !== undefined) {
      updateFields.push('currentAmount = ?');
      values.push(
        typeof updates.currentAmount === 'string'
          ? parseFloat(updates.currentAmount)
          : updates.currentAmount
      );
    }
    if (updates.deadline !== undefined) {
      updateFields.push('deadline = ?');
      values.push(
        updates.deadline
          ? typeof updates.deadline === 'string'
            ? updates.deadline
            : new Date().toISOString()
          : null
      );
    }
    if (updates.color !== undefined) {
      updateFields.push('color = ?');
      values.push(updates.color ?? null);
    }
    if (updates.isArchived !== undefined) {
      updateFields.push('status = ?');
      values.push(updates.isArchived ? 'cancelled' : 'active');
    }

    // Always update updatedAt
    updateFields.push('updatedAt = ?');
    values.push(new Date().toISOString());

    values.push(goalId);

    await db.execute(`UPDATE goals SET ${updateFields.join(', ')} WHERE id = ?`, values);

    const goal = await this.getGoal(goalId);
    if (!goal) throw new Error(`Goal ${goalId} not found`);
    return goal;
  }

  async deleteGoal(goalId: string): Promise<void> {
    const db = await getDatabase();

    // Get the goal to verify it exists
    const goalResult = await db.execute('SELECT * FROM goals WHERE id = ?', [goalId]);
    if (!goalResult.rows || goalResult.rows.length === 0) {
      throw new Error('Goal not found');
    }

    // Begin transaction for atomic operations
    await db.execute('BEGIN TRANSACTION');

    try {
      // Delete all goal transactions (balance will automatically adjust when recalculated)
      await db.execute('DELETE FROM transactions WHERE goalId = ?', [goalId]);

      // Delete the goal
      await db.execute('DELETE FROM goals WHERE id = ?', [goalId]);

      await db.execute('COMMIT');
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  }

  async contributeToGoal(
    goalId: string,
    amount: number,
    accountId: string,
    _description?: string
  ): Promise<Transaction> {
    const db = await getDatabase();

    // Get goal
    const goal = await this.getGoal(goalId);
    if (!goal) throw new Error('Goal not found');

    // Create transaction and update goal in a transaction
    const transaction = await this.createTransaction(goal.userId, {
      accountId,
      categoryId: 'goal-contribution',
      amount: amount.toString(),
      type: 'goal-contribution',
      description: `Contribution to ${goal.name}`,
      date: new Date().toISOString(),
      goalId,
      isEssential: false,
    });

    // Update goal current amount
    await db.execute(
      'UPDATE goals SET currentAmount = currentAmount + ?, updatedAt = ? WHERE id = ?',
      [amount, new Date().toISOString(), goalId]
    );

    // Check if goal is completed
    const updatedGoal = await this.getGoal(goalId);
    if (updatedGoal && updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      await db.execute('UPDATE goals SET status = ?, updatedAt = ? WHERE id = ?', [
        'completed',
        new Date().toISOString(),
        goalId,
      ]);
    }

    return transaction;
  }

  async withdrawFromGoal(
    goalId: string,
    amount: number,
    accountId: string,
    _description?: string
  ): Promise<Transaction> {
    const db = await getDatabase();

    // Get goal
    const goal = await this.getGoal(goalId);
    if (!goal) throw new Error('Goal not found');

    // Create transaction and update goal in a transaction
    const transaction = await this.createTransaction(goal.userId, {
      accountId,
      categoryId: 'goal-withdrawal',
      amount: amount.toString(),
      type: 'goal-withdrawal',
      description: `Withdrawal from ${goal.name}`,
      date: new Date().toISOString(),
      goalId,
      isEssential: false,
    });

    // Update goal current amount
    await db.execute(
      'UPDATE goals SET currentAmount = currentAmount - ?, updatedAt = ? WHERE id = ?',
      [amount, new Date().toISOString(), goalId]
    );

    return transaction;
  }

  // ==================== Query Helper Methods ====================

  async getTransactionsByAccount(
    accountId: string,
    options?: QueryOptions
  ): Promise<Transaction[]> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM transactions WHERE accountId = ?', [accountId]);
    const transactions = (result.rows as any[]).map((row: any) => this.parseTransaction(row));
    return this.applySortAndPagination(transactions, options);
  }

  async getTransactionsByCategory(
    categoryId: string,
    options?: QueryOptions
  ): Promise<Transaction[]> {
    const db = await getDatabase();
    const result = await db.execute('SELECT * FROM transactions WHERE categoryId = ?', [
      categoryId,
    ]);
    const transactions = (result.rows as any[]).map((row: any) => this.parseTransaction(row));
    return this.applySortAndPagination(transactions, options);
  }

  async updateBudgetSpent(budgetId: string, spent: number): Promise<void> {
    const db = await getDatabase();
    await db.execute('UPDATE budgets SET spent = ?, updatedAt = ? WHERE id = ?', [
      spent,
      new Date().toISOString(),
      budgetId,
    ]);
  }

  async updateGoalAmount(goalId: string, amount: number): Promise<void> {
    const db = await getDatabase();
    await db.execute('UPDATE goals SET currentAmount = ?, updatedAt = ? WHERE id = ?', [
      amount,
      new Date().toISOString(),
      goalId,
    ]);
  }

  private applySortAndPagination<T extends Record<string, any>>(
    items: T[],
    options?: QueryOptions
  ): T[] {
    let result = [...items];

    // Apply sorting
    if (options?.sortBy) {
      result.sort((a, b) => {
        const aVal = a[options.sortBy!];
        const bVal = b[options.sortBy!];
        if (aVal === undefined || bVal === undefined) return 0;
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    if (options?.limit) {
      const offset = options.offset ?? 0;
      result = result.slice(offset, offset + options.limit);
    }

    return result;
  }

  // ==================== Utility Operations ====================

  async clearDatabase(): Promise<void> {
    const db = await getDatabase();
    await dropAllTables(db);
    await initializeDatabase(db);
  }

  async getTotalBalance(userId: string, excludeInactive?: boolean): Promise<number> {
    const db = await getDatabase();
    const query = excludeInactive
      ? 'SELECT SUM(balance) as total FROM accounts WHERE userId = ? AND isActive = 1'
      : 'SELECT SUM(balance) as total FROM accounts WHERE userId = ?';
    const result = await db.execute(query, [userId]);
    return (result.rows?.[0] as any)?.total ?? 0;
  }

  async getNetWorth(userId: string): Promise<number> {
    const db = await getDatabase();
    // Assets - Liabilities (debt goals count as liabilities)
    const result = await db.execute(
      `SELECT 
        (SELECT COALESCE(SUM(balance), 0) FROM accounts WHERE userId = ?) as assets,
        (SELECT COALESCE(SUM(targetAmount - currentAmount), 0) FROM goals WHERE userId = ? AND type = 'debt') as liabilities
      `,
      [userId, userId]
    );
    const row = result.rows?.[0] as any;
    return (row?.assets ?? 0) - (row?.liabilities ?? 0);
  }

  async getTransactionCount(userId: string, filters?: TransactionFilters): Promise<number> {
    const transactions = await this.getTransactions(userId, filters);
    return transactions.length;
  }

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
    try {
      const db = await getDatabase();
      const counts = {
        transactions: 0,
        budgets: 0,
        goals: 0,
        accounts: 0,
        categories: 0,
      };

      await db.transaction(async (tx) => {
        // Migrate accounts
        const accountsResult = await tx.execute('UPDATE accounts SET userId = ? WHERE userId = ?', [
          toAuthUserId,
          fromGuestUserId,
        ]);
        counts.accounts = accountsResult.rowsAffected ?? 0;

        // Migrate categories (excluding defaults)
        const categoriesResult = await tx.execute(
          'UPDATE categories SET userId = ? WHERE userId = ? AND isDefault = 0',
          [toAuthUserId, fromGuestUserId]
        );
        counts.categories = categoriesResult.rowsAffected ?? 0;

        // Migrate transactions
        const transactionsResult = await tx.execute(
          'UPDATE transactions SET userId = ? WHERE userId = ?',
          [toAuthUserId, fromGuestUserId]
        );
        counts.transactions = transactionsResult.rowsAffected ?? 0;

        // Migrate budgets
        const budgetsResult = await tx.execute('UPDATE budgets SET userId = ? WHERE userId = ?', [
          toAuthUserId,
          fromGuestUserId,
        ]);
        counts.budgets = budgetsResult.rowsAffected ?? 0;

        // Migrate goals
        const goalsResult = await tx.execute('UPDATE goals SET userId = ? WHERE userId = ?', [
          toAuthUserId,
          fromGuestUserId,
        ]);
        counts.goals = goalsResult.rowsAffected ?? 0;

        // Delete guest user
        await tx.execute('DELETE FROM users WHERE id = ?', [fromGuestUserId]);
      });

      return {
        success: true,
        migratedCounts: counts,
      };
    } catch (error) {
      return {
        success: false,
        migratedCounts: {
          transactions: 0,
          budgets: 0,
          goals: 0,
          accounts: 0,
          categories: 0,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ==================== Import/Export Operations ====================

  async exportDatabase(userId?: string): Promise<string> {
    if (!userId) throw new Error('userId is required for export');

    // Get all user data
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    const accounts = await this.getAccounts(userId);
    const categories = await this.getCategories(userId);
    const transactions = await this.getTransactions(userId);
    const budgets = await this.getBudgets(userId);
    const goals = await this.getGoals(userId);

    const data: ExportData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      users: [user],
      accounts,
      categories,
      transactions,
      budgets,
      goals,
      settings: user.settings ?? {},
    };

    return JSON.stringify(data, null, 2);
  }

  async importDatabase(jsonData: string, targetUserId?: string): Promise<void> {
    const db = await getDatabase();

    // Parse JSON data
    const data = JSON.parse(jsonData) as ExportData;

    // Detect backup user ID
    const backupUserId = detectBackupUserId(data);
    const _userId = targetUserId ?? backupUserId;

    // Clean data
    const cleanedData = cleanExportData(data);

    // Normalize and remap individual records
    const normalizedData: ExportData = {
      ...cleanedData,
      users: cleanedData.users,
      accounts: (cleanedData.accounts ?? []).map((acc: any) =>
        targetUserId && backupUserId ? remapUserId(acc, targetUserId) : acc
      ),
      categories: (cleanedData.categories ?? []).map((c: any) =>
        normalizeCategoryIdsInRecord(
          targetUserId && backupUserId ? remapUserId(c, targetUserId) : c
        )
      ),
      transactions: (cleanedData.transactions ?? []).map((t: any) =>
        normalizeCategoryIdsInRecord(
          targetUserId && backupUserId ? remapUserId(t, targetUserId) : t
        )
      ),
      budgets: (cleanedData.budgets ?? []).map((b: any) =>
        normalizeCategoryIdsInRecord(
          migrateBudgetCategoryIds(targetUserId && backupUserId ? remapUserId(b, targetUserId) : b)
        )
      ),
      goals: (cleanedData.goals ?? []).map((g: any) =>
        targetUserId && backupUserId ? remapUserId(g, targetUserId) : g
      ),
    };

    // Import in a transaction
    await db.transaction(async (tx) => {
      // Import user
      const user = normalizedData.users?.[0];
      if (!user) throw new Error('No user data in import');
      await tx.execute(
        `INSERT OR REPLACE INTO users (id, email, displayName, photoURL, settings, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.email ?? null,
          user.displayName ?? null,
          user.photoURL ?? null,
          JSON.stringify(user.settings ?? {}),
          user.createdAt.toISOString(),
          user.updatedAt.toISOString(),
        ]
      );

      // Import accounts
      for (const account of normalizedData.accounts ?? []) {
        await tx.execute(
          `INSERT OR REPLACE INTO accounts (id, userId, name, type, balance, currency, icon, color, isActive, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            account.id,
            account.userId,
            account.name,
            account.type,
            account.balance,
            account.currency,
            account.icon ?? null,
            account.color ?? null,
            account.isActive ? 1 : 0,
            account.createdAt.toISOString(),
            account.updatedAt.toISOString(),
          ]
        );
      }

      // Import categories
      for (const category of normalizedData.categories ?? []) {
        await tx.execute(
          `INSERT OR REPLACE INTO categories (id, userId, name, type, icon, color, parentId, isDefault, "order")
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            category.id,
            category.userId,
            category.name,
            category.type,
            category.icon,
            category.color,
            category.parentId ?? null,
            category.isDefault ? 1 : 0,
            category.order,
          ]
        );
      }

      // Import budgets
      for (const budget of normalizedData.budgets ?? []) {
        await tx.execute(
          `INSERT OR REPLACE INTO budgets (id, userId, name, amount, period, categoryIds, startDate, endDate, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            budget.id,
            budget.userId,
            budget.name,
            budget.amount,
            budget.period,
            JSON.stringify(budget.categoryIds),
            budget.startDate.toISOString(),
            budget.endDate?.toISOString() ?? null,
            budget.createdAt.toISOString(),
            budget.updatedAt.toISOString(),
          ]
        );
      }

      // Import goals
      for (const goal of normalizedData.goals ?? []) {
        await tx.execute(
          `INSERT OR REPLACE INTO goals (id, userId, name, type, targetAmount, currentAmount, deadline, status, accountId, icon, color, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            goal.id,
            goal.userId,
            goal.name,
            goal.type,
            goal.targetAmount,
            goal.currentAmount,
            goal.deadline?.toISOString() ?? null,
            goal.status,
            goal.accountId ?? null,
            goal.icon,
            goal.color ?? null,
            goal.createdAt.toISOString(),
            goal.updatedAt.toISOString(),
          ]
        );
      }

      // Import transactions (without balance updates, they're already reflected)
      for (const transaction of normalizedData.transactions ?? []) {
        await tx.execute(
          `INSERT OR REPLACE INTO transactions (id, userId, accountId, categoryId, subcategoryId, amount, type, description, date, tags, isRecurring, recurringId, toAccountId, goalId, isEssential, synced, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            transaction.id,
            transaction.userId,
            transaction.accountId,
            transaction.categoryId,
            transaction.subcategoryId ?? null,
            transaction.amount,
            transaction.type,
            transaction.description ?? null,
            transaction.date.toISOString(),
            JSON.stringify(transaction.tags ?? []),
            transaction.isRecurring ? 1 : 0,
            transaction.recurringId ?? null,
            transaction.toAccountId ?? null,
            transaction.goalId ?? null,
            transaction.isEssential ? 1 : 0,
            transaction.synced ? 1 : 0,
            transaction.createdAt.toISOString(),
            transaction.updatedAt.toISOString(),
          ]
        );
      }
    });

    // Log migration report
    const report = generateMigrationReport(normalizedData);
    console.log('Import complete:', report);
  }

  // ==================== Helper Methods for Parsing ====================

  private parseUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      displayName: row.displayName,
      photoURL: row.photoURL,
      settings: row.settings
        ? JSON.parse(row.settings)
        : {
            currency: 'USD',
            dateFormat: 'MM/dd/yyyy',
            theme: 'system',
            language: 'en',
            financialMonthStart: 1,
            notifications: {
              budgetAlerts: true,
              billReminders: true,
              weeklyReports: false,
              unusualSpending: true,
            },
          },
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  private parseAccount(row: any): Account {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      type: row.type,
      initialBalance: row.initialBalance || 0,
      balance: 0, // Will be calculated separately
      currency: row.currency,
      icon: row.icon,
      color: row.color,
      isActive: row.isActive === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  /**
   * Calculate and set balance for an account from transactions
   */
  private async calculateAndSetAccountBalance(account: Account): Promise<Account> {
    const db = await getDatabase();

    // Get all transactions for this account (as source)
    const txResult = await db.execute('SELECT * FROM transactions WHERE accountId = ?', [
      account.id,
    ]);
    const transactions = txResult.rows.map((txRow) => this.parseTransaction(txRow));

    // Get incoming transfers (where this account is destination)
    const transferResult = await db.execute(
      'SELECT * FROM transactions WHERE toAccountId = ? AND type = ?',
      [account.id, 'transfer']
    );
    const incomingTransfers = transferResult.rows.map((txRow) => this.parseTransaction(txRow));

    // Calculate balance
    account.balance = calculateAccountBalance(account.initialBalance, transactions);

    // Add incoming transfers
    for (const transfer of incomingTransfers) {
      account.balance += transfer.amount;
    }

    return account;
  }

  private parseCategory(row: any): Category {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      type: row.type,
      icon: row.icon,
      color: row.color,
      parentId: row.parentId,
      isDefault: row.isDefault === 1,
      order: row.order,
    };
  }

  private parseTransaction(row: any): Transaction {
    return {
      id: row.id,
      userId: row.userId,
      accountId: row.accountId,
      categoryId: row.categoryId,
      subcategoryId: row.subcategoryId,
      amount: row.amount,
      type: row.type,
      description: row.description,
      date: new Date(row.date),
      tags: row.tags ? JSON.parse(row.tags) : [],
      isRecurring: row.isRecurring === 1,
      recurringId: row.recurringId,
      toAccountId: row.toAccountId,
      goalId: row.goalId,
      isEssential: row.isEssential === 1,
      synced: row.synced === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  private parseBudget(row: any): Budget {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      amount: row.amount,
      spent: row.spent ?? 0,
      period: row.period,
      categoryIds: JSON.parse(row.categoryIds),
      startDate: new Date(row.startDate),
      endDate: row.endDate ? new Date(row.endDate) : undefined,
      rollover: row.rollover === 1,
      isActive: row.isActive === 1,
      alerts: {
        thresholds: [50, 80, 100],
        enabled: true,
      },
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  private parseGoal(row: any): Goal {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      type: row.type,
      targetAmount: row.targetAmount,
      currentAmount: row.currentAmount,
      deadline: row.deadline ? new Date(row.deadline) : undefined,
      status: row.status,
      accountId: row.accountId,
      icon: row.icon,
      color: row.color,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
}

// Export singleton instance
export const adapter = new SQLiteAdapter();
